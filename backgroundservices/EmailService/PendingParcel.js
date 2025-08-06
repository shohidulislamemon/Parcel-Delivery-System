const ejs = require("ejs");
const dotenv = require("dotenv");
const sendMail = require("../helpers/sendmail");
const Parcel = require("../models/Parcel");

dotenv.config();

const SendParcelPendingEmail = async () => {
    const parcels = await Parcel.find({ status: 0 });

    if (parcels.length > 0) {
        for (let parcel of parcels) {
            ejs.renderFile(
                "./templates/pendingparcel.ejs",
                {
                    senderName: parcel.senderName,
                    from: parcel.from,
                    to: parcel.to,
                    recipientName: parcel.recipientName,
                    cost: parcel.cost,
                    weight: parcel.weight,
                    note: parcel.note,
                },
                async (err, info) => {
                    let messageOption = {
                        from: process.env.MAIL,
                        to: parcel.recipientEmail,
                        subject: "You've got a parcel",
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
                "./templates/pendingparcel.ejs",
                {
                    senderName: parcel.senderName,
                    from: parcel.from,
                    to: parcel.to,
                    recipientName: parcel.recipientName,
                    cost: parcel.cost,
                    weight: parcel.weight,
                    note: parcel.note,
                },
                async (err, info) => {
                    let messageOption = {
                        from: process.env.MAIL,
                        to: parcel.senderEmail,
                        subject: "Your parcel is begin processed",
                        html: info,
                    };
                    try {
                        await sendMail(messageOption);
                        await Parcel.findByIdAndUpdate(parcel._id,{$set: {status:1}})
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        }
    }
};

module.exports = { SendParcelPendingEmail };
