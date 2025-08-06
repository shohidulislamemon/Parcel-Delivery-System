const ejs = require("ejs");
const dotenv = require("dotenv");
const sendMail = require("../helpers/sendmail");
const Parcel = require("../models/Parcel");

dotenv.config();

const SendParcelDeliveredEmail = async () => {
    const parcels = await Parcel.find({ status: 2 });

    if (parcels.length > 0) {
        for (let parcel of parcels) {
            ejs.renderFile(
                "./templates/deliveredparcel.ejs",
                {
                    senderName: parcel.senderName,
                    from: parcel.from,
                    to: parcel.to,
                    recipientName: parcel.recipientName,
                    cost: parcel.cost,
                    weight: parcel.weight,
                    note: parcel.note,
                },
                async (err, data) => {
                    let messageOption = {
                        from: process.env.MAIL,
                        to: parcel.recipientEmail,
                        subject: "Your parcel has been delivered",
                        html: info,
                    };
                    try {
                        await sendMail(messageOption);
                    } catch (error) {
                        console.log(error);
                    }
                }
            );

            ejs.renderFile(
                "./templates/deliveredparcel.ejs",
                {
                    senderName: parcel.senderName,
                    from: parcel.from,
                    to: parcel.to,
                    recipientName: parcel.recipientName,
                    cost: parcel.cost,
                    weight: parcel.weight,
                    note: parcel.note,
                },
                async (err, data) => {
                    let messageOption = {
                        from: process.env.MAIL,
                        to: parcel.senderEmail,
                        subject: "Your parcel has been delivered",
                        html: info,
                    };
                    try {
                        await sendMail(messageOption);
                        await Parcel.findByIdAndUpdate(parcel._id,{$set: {status:3}})
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        }
    }
};

module.exports = { SendParcelDeliveredEmail };
