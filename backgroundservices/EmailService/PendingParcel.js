const ejs = require("ejs");
const dotenv = require("dotenv");
const sendMail = require("../helpers/sendmail");
const Parcel = require("../models/Parcel");
const path = require("path");

dotenv.config();

const renderTemplate = (data) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(
            path.join(__dirname, "../templates/pendingparcel.ejs"),
            data,
            (err, html) => {
                if (err) reject(err);
                else resolve(html);
            }
        );
    });
};

const SendParcelPendingEmail = async () => {
    const parcels = await Parcel.find({ status: 0 });

    if (parcels.length > 0) {
        for (let parcel of parcels) {
            const commonData = {
                senderName: parcel.senderName,
                from: parcel.from,
                to: parcel.to,
                recipientName: parcel.recipientName,
                cost: parcel.cost,
                weight: parcel.weight,
                note: parcel.note,
                senderEmail: parcel.senderEmail,
                recipientEmail: parcel.recipientEmail,
            };

            try {
                const htmlContent = await renderTemplate(commonData);

                // Email to recipient
                await sendMail({
                    from: process.env.MAIL,
                    to: parcel.recipientEmail,
                    subject: "📦 You've got a parcel",
                    html: htmlContent,
                });

                // Email to sender
                await sendMail({
                    from: process.env.MAIL,
                    to: parcel.senderEmail,
                    subject: "✅ Your parcel is being processed",
                    html: htmlContent,
                });

                // Update parcel status
                await Parcel.findByIdAndUpdate(parcel._id, {
                    $set: { status: 1 },
                });
            } catch (error) {
                console.error("❌ Error sending parcel emails:", error);
            }
        }
    }
};

module.exports = { SendParcelPendingEmail };
