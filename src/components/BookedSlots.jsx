import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Link } from "react-router-dom";
dayjs.locale("id");

const BookedSlots = () => {
  const [bookings, setBookings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [workDaysInMonth, setWorkDaysInMonth] = useState([]);

  const availableTimes = [
    "08:30-09:00",
    "09:00-09:30",
    "09:30-10:00",
    "10:00-10:30",
    "10:30-11:00",
    "11:00-11:30",
  ];

  // Navigasi bulan
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  // Generate hari kerja dalam bulan berjalan
  useEffect(() => {
    const daysInMonth = currentMonth.daysInMonth();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs(
        `${currentMonth.format("YYYY-MM")}-${i.toString().padStart(2, "0")}`
      );
      if (date.day() !== 0 && date.day() !== 6) {
        days.push(date);
      }
    }

    setWorkDaysInMonth(days);
  }, [currentMonth]);

  // Ambil data dari Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "bookingGigi"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      } catch (error) {
        console.error("Gagal memuat data booking:", error);
      }
    };

    fetchBookings();
  }, []);

  // Cek apakah slot terbooking
  const isSlotBooked = (tanggal, jam) => {
    return bookings.some(
      (booking) => booking.tanggal === tanggal && booking.jam === jam
    );
  };

  return (
    <>
      <Navbar />
      <div
        className="w-full min-h-screen bg-cover bg-center py-16 px-4"
        style={{ backgroundImage: 'url("/bgg.jpg")' }} // Ganti sesuai path
      >
        <div className="md:max-w-8xl w-full mx-auto px-2 md:px-4 mt-5 py-6 text-black ">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2 bg-gray-100 rounded-lg p-4 shadow-md">
            <h1 className="w-full md:w-auto text-center  text-xl md:text-2xl font-bold text-[#76BBDD] transition duration-300">
              Jadwal Booking – {currentMonth.format("MMMM YYYY")}
            </h1>
          </div>
          <div className="flex items-center justify-between p-2">
            <button
              onClick={goToPreviousMonth}
              className="bg-[#76BBDD] hover:bg-[#5da7ce] px-1 text-xs md:text-sm md:px-3 py-1 rounded text-white"
            >
              ← Bulan Sebelumnya
            </button>
            <button
              onClick={goToNextMonth}
              className="bg-[#76BBDD] hover:bg-[#5da7ce] text-xs md:text-sm px-1 md:px-3 py-1 rounded text-white"
            >
              Bulan Berikutnya →
            </button>
          </div>

          <div className="overflow-x-auto max-w-full bg-gray-300">
            <div className="min-w-[900px]">
              <table className="w-full border  border-[#76BBDD]  text-sm">
                <thead className="sticky top-0 z-20 bg-gray-100">
                  <tr>
                    <th className="border-2 border-[#76BBDD]  px-2 py-2 text-center whitespace-nowrap sticky left-0 z-30 bg-gray-100">
                      Jam / Tanggal
                    </th>
                    {workDaysInMonth.map((day, index) => (
                      <th
                        key={index}
                        className="border border-[#76BBDD] px-2 py-2 text-center whitespace-nowrap text-xs md:text-sm"
                      >
                        {day.format("DD MMM (ddd)")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availableTimes.map((time, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border border-[#76BBDD] px-2 py-2 font-medium text-center whitespace-nowrap text-xs md:text-sm sticky left-0 bg-white z-10">
                        {time}
                      </td>
                      {workDaysInMonth.map((day, colIndex) => {
                        const tanggal = day.format("YYYY-MM-DD");
                        const booked = isSlotBooked(tanggal, time);
                        return (
                          <td
                            key={colIndex}
                            className={`border border-[#76BBDD] px-1 py-1 text-center text-xs md:text-sm ${
                              booked
                                ? "bg-red-200 text-gray-600"
                                : "bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            {booked ? "Terisi" : "Tersedia"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 text-left mb-10">
            <Link
              to="/"
              className="inline-block bg-[#76BBDD] hover:bg-[#5da7ce]  text-white font-medium px-2 md:px-4 py-1 md:py-2 rounded transition duration-200 text-sm md:text-base"
            >
              ← Kembali ke Form
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookedSlots;
