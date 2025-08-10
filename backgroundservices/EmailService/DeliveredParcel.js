const ejs = require("ejs");
const dotenv = require("dotenv");
const sendMail = require("../helpers/sendmail");
const Parcel = require("../models/Parcel");
const path = require("path");

dotenv.config();

const renderTemplate = (templatePath, data) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, (err, html) => {
            if (err) reject(err);
            else resolve(html);
        });
    });
};

const SendParcelDeliveredEmail = async () => {
    const parcels = await Parcel.find({ status: 3 });

    if (parcels.length > 0) {
        for (let parcel of parcels) {
            const commonData = {
                senderName: parcel.senderName,
                senderEmail: parcel.senderEmail,
                recipientEmail: parcel.recipientEmail,
                from: parcel.from,
                to: parcel.to,
                recipientName: parcel.recipientName,
                cost: parcel.cost,
                weight: parcel.weight,
                note: parcel.note,
            };

            try {
                const htmlContent = await renderTemplate(
                    path.join(__dirname, "../templates/deliveredparcel.ejs"),
                    commonData
                );

                // Send to recipient
                await sendMail({
                    from: process.env.MAIL,
                    to: parcel.recipientEmail,
                    subject: "📦 Your parcel has been delivered",
                    html: htmlContent,
                });

                // Send to sender
                await sendMail({
                    from: process.env.MAIL,
                    to: parcel.senderEmail,
                    subject: "📬 Delivery confirmation for your parcel",
                    html: htmlContent,
                });

                // Update status to 3
                await Parcel.findByIdAndUpdate(parcel._id, {
                    $set: { status: 4 },
                });
            } catch (error) {
                console.error("❌ Error sending delivery emails:", error);
            }
        }
    }
};

module.exports = { SendParcelDeliveredEmail };
