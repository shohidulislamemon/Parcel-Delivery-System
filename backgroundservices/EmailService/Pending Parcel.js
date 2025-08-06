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
                "../templates/pendingparcel.ejs", {
                senderName: parcel.senderName,
                from: parcel.from,
                to: parcel.to,
                recipientName: parcel.recipientName,
                cost: parcel.cost,
                weight: parcel.weight,
                note: parcel.note,

            }, async (err, data) => {
                let messageOption = {
                    from: process.env.MAIL,
                    to: parcel.senderEmail,
                    subject: "You've got a parcel",
                    html: info,
                };
                try {
                    await sendMail(messageOption)
                } catch (error) {
                    console.log(error)
                }
            }
            )
        }
    }

}


module.exports = { SendParcelPendingEmail }