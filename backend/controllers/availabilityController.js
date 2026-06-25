import doctorAvailabilityModel from "../models/doctorAvailabilityModel.js";
import doctorModel from "../models/doctorModel.js";

const setAvailability = async (req, res) => {
    try {
        const { docId, availability } = req.body;

        if (!docId || !availability || !Array.isArray(availability)) {
            return res.json({ success: false, message: "Missing or invalid Details" });
        }

        for (let slot of availability) {
            if (slot.dayOfWeek === undefined || !slot.startTime || !slot.endTime) {
                return res.json({ success: false, message: "Invalid availability format" });
            }
            if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
                return res.json({ success: false, message: "Day of week must be 0-6" });
            }
        }

        let availabilityData = await doctorAvailabilityModel.findOne({ docId });

        if (!availabilityData) {
            availabilityData = await doctorAvailabilityModel.create({
                docId,
                availability,
                updatedAt: Date.now()
            });
        } else {
            availabilityData.availability = availability;
            availabilityData.updatedAt = Date.now();
            await availabilityData.save();
        }

        res.json({ success: true, message: "Availability updated", availability: availabilityData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAvailability = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.json({ success: false, message: "Doctor ID required" });
        }

        const availability = await doctorAvailabilityModel.findOne({ docId });

        if (!availability) {
            return res.json({ success: true, availability: null });
        }

        res.json({ success: true, availability });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const addHoliday = async (req, res) => {
    try {
        const { docId, date, reason } = req.body;

        if (!docId || !date) {
            return res.json({ success: false, message: "Missing Details" });
        }

        let availability = await doctorAvailabilityModel.findOne({ docId });

        if (!availability) {
            availability = await doctorAvailabilityModel.create({
                docId,
                availability: [],
                holidays: [{
                    date: typeof date === 'string' ? new Date(date).getTime() : date,
                    reason: reason || ""
                }],
                updatedAt: Date.now()
            });
        } else {
            availability.holidays.push({
                date: typeof date === 'string' ? new Date(date).getTime() : date,
                reason: reason || ""
            });
            availability.updatedAt = Date.now();
            await availability.save();
        }

        res.json({ success: true, message: "Holiday added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const removeHoliday = async (req, res) => {
    try {
        const { docId, date } = req.body;

        if (!docId || !date) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const availability = await doctorAvailabilityModel.findOne({ docId });

        if (!availability) {
            return res.json({ success: false, message: "No availability record found" });
        }

        const dateTime = typeof date === 'string' ? new Date(date).getTime() : date;
        
        availability.holidays = availability.holidays.filter(h => h.date !== dateTime);
        availability.updatedAt = Date.now();
        await availability.save();

        res.json({ success: true, message: "Holiday removed" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { docId, date } = req.body;

        if (!docId || !date) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const availability = await doctorAvailabilityModel.findOne({ docId });
        
        if (!availability || !availability.availability.length) {
            return res.json({ success: true, availableSlots: [] });
        }

        const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
        const dayOfWeek = dateObj.getDay();

        const isHoliday = availability.holidays.some(h => {
            const holidayDate = new Date(h.date);
            return holidayDate.toDateString() === dateObj.toDateString();
        });

        if (isHoliday) {
            return res.json({ success: true, availableSlots: [] });
        }

        const dayAvailability = availability.availability.find(a => a.dayOfWeek === dayOfWeek && a.isAvailable);

        if (!dayAvailability) {
            return res.json({ success: true, availableSlots: [] });
        }

        const slots = generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime, dayAvailability.slotDuration);
        
        const doctor = await doctorModel.findById(docId);
        const dateStr = typeof date === 'string' ? date : dateObj.toISOString().split('T')[0];
        const bookedSlots = doctor.slots_booked[dateStr] || [];

        const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

        res.json({ success: true, availableSlots });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const generateTimeSlots = (startTime, endTime, durationMinutes) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        slots.push(timeStr);

        currentMin += durationMinutes;
        if (currentMin >= 60) {
            currentHour += Math.floor(currentMin / 60);
            currentMin = currentMin % 60;
        }
    }

    return slots;
};

export { setAvailability, getAvailability, addHoliday, removeHoliday, getAvailableSlots };
