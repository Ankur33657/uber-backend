const Ride = require("../models/ride.model");
const Captain = require("../models/captain.model");
const constant = require("../utils/constant");
const { sendMessageToSocketId, rideEvents } = require("../sockets/socket");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const ride = await Ride.find({ _id: currentUser?._id });
  return {
    code: constant?.ResponseCode?.OK,
    message: "Ride fetch successfully",
    data: ride,
  };
};

module.exports = {
  findingCaptainandAssignRideService,
  ChangeRideStatus,
  getPreviousRide,
};
