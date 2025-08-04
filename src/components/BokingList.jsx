import React, { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase"; // sesuaikan path

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bookingGigi"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Memuat data booking...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Daftar Booking Rawat Gigi</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Tanggal</th>
              <th className="border px-4 py-2">Jam</th>
              <th className="border px-4 py-2">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.email || "-"}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2">
                  {item.status === "Keluarga" ? item.namaPasien : item.nama}
                </td>
                <td className="border px-4 py-2">{item.tanggal}</td>
                <td className="border px-4 py-2">{item.jam}</td>
                <td className="border px-4 py-2">{item.tindakan || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
