const Ride = require("../models/ride.model");
const Captain = require("../models/captain.model");
const constant = require("../utils/constant");
const Utils = require("../utils/utils");
const { sendMessageToSocketId, rideEvents } = require("../sockets/socket");
const CommonServices = require("./common.service");

const findingCaptainandAssignRideService = async (currentUser, data) => {
  /* -Search for captains within a 20 km radius who are active and not busy.
     -Notify eligible captains using an algorithm that prioritizes those who
      have earned less, ensuring fair distribution of rides.
     -If a captain does not accept the request within 10 seconds, forward the
      request to the next available captain.*/

  const captains = await Captain.find({
    $and: [{ isOnline: true }, { isBusy: false }],
  }).sort({ "earning.today": 1 });

  if (captains.length === 0)
    throw {
      code: constant?.ResponseCode?.NOT_FOUND,
      message: "No Captains Available nearby",
    };

  const rideId = `${currentUser._id}-${Date.now()}`;
  let acceptedCaptain = null;

  for (const cap of captains) {
    sendMessageToSocketId(cap.user.toString(), {
      data: { user: currentUser, metaData: data, rideId },
      event: "ride-booking",
    });

    const result = await Promise.race([
      new Promise((resolve) => {
        rideEvents.once(`ride-accepted-${rideId}`, (acceptData) => {
          resolve({ status: "accepted", data: acceptData });
        });
      }),
      new Promise((resolve) =>
        setTimeout(
          () => resolve({ status: "timeout" }),
          constant?.TIME_INTERVAL_NOTIFICATIONS,
        ),
      ),
    ]);

    if (result.status === "accepted") {
      acceptedCaptain = await Captain.findOne({ user: result.data.captainId });
      break;
    }
   
  }

  if (acceptedCaptain) {
    const ride = new Ride({
      userId: currentUser?._id,
      captain: acceptedCaptain?._id,
      src: data?.src,
      destination: data?.destination,
      fare: data?.fare,
      status: "accepted",
      duration: data?.duration,
      distance: data?.distance,
    });
    await ride.save();
    return {
      code: constant?.ResponseCode?.OK,
      message: "Captain Found and Assigned",
      data: acceptedCaptain,
    };
  } else {
    throw {
      code: constant?.ResponseCode?.NOT_FOUND,
      message: "No captain accepted the request",
    };
  }
};

const ChangeRideStatus = async (data) => {
  const ride = await Ride.findByIdAndUpdate(
    data?._id,
    { status: data?.status },
    { new: true, runValidators: true },
  );

  return {
    code: constant?.ResponseCode?.OK,
    message: "Ride updated successfully",
    data: ride,
  };
};

const getPreviousRide = async (currentUser) => {
  const rides = await Ride.find({ userId: currentUser?._id });
  return {
    code: constant?.ResponseCode?.OK,
    message: "Rides fetched successfully",
    data: rides,
  };
};


const findingPath = async (data) => {
  const { coordinate } = data;
  // coordinate formate
  // (-0.12070277, 51.514156);
  // (-0.12360937, 51.507996);
  const response = await fetch(
    `https://us1.locationiq.com/v1/directions/driving/${coordinate}?key=${process.env.RAPID_API_KEY}&steps=true&alternatives=true&geometries=geojson&overview=full`,
  );
  const routes = await response.json();
  if (routes.code === "Ok") {
    return {
      code: constant?.ResponseCode?.OK,
      message: "Route fetch",
      data: routes,
    };
  } else {
    return {
      code: constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      message: "Error in fetching",
      data: null,
    };
  }
};

const calculatingPrice = async (data) => {
  const { source, destination, selectedRoute, journeyTime } = data;
  const price = await CommonServices?.SurgePriceCalculate({
    currentTime: journeyTime,
    distance: selectedRoute?.distance / 1000,
    time: selectedRoute?.duration / 60,
  });
  //arrival time is hardcorded for now

  const responseFormat = constant?.VEHICLE_CONFIG.map((vehicle) => ({
    key: vehicle.key,
    type: vehicle.type,
    arrivalTime: vehicle.arrivalTime,
    capacity: vehicle.capacity,
    price: (price * (constant?.VEHICLE_MULTIPLIER?.[vehicle.key] || 1)).toFixed(
      2,
    ),
  }));

  return {
    code: constant?.ResponseCode?.OK,
    message: "price calculated",
    data: responseFormat,
  };
};


const getWeeklyRecord = async (currentCaptain) => {
  const date = Utils?.getCurrentWeekDates();
  const record = await Ride.find({
    captain: currentCaptain?._id,
    createdAt: {
      $gte: date?.start,
      $lte: date?.end,
    },
  });
  if (record) {
    let value = 0,
      distance = 0,
      time = 0,
      trip = 0;

    record.forEach((item) => {
      if (item?.status === "completed") {
        value += item?.fare;
        distance += item?.duration;
        time += item?.distance;
        trip++;
      }
    });
    return {
      code: constant?.ResponseCode?.OK,
      message: "data fetch successfully",
      data: {
        overall: {
          value: value,
          distance: distance / 1000,
          time: time / 60,
          trip: trip,
        },
        record,
      },
    };
  }
  throw {
    code: constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
    message: "Error in fetching data",
  };
};

module.exports = {
  findingCaptainandAssignRideService,
  ChangeRideStatus,
  getPreviousRide,
  findingPath,
  calculatingPrice,
  getWeeklyRecord,
};
