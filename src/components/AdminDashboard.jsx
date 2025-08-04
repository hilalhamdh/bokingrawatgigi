import React, { useEffect, useState } from "react";
import { db, collection, getDocs, doc, updateDoc } from "../firebase";
import QRVerifyBooking from "./QRVerifiyBooking";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchBookings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "bookingGigi"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        verified: doc.data().verified ?? false,
      }));
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;
    if (dateFrom) filtered = filtered.filter((b) => b.tanggal >= dateFrom);
    if (dateTo) filtered = filtered.filter((b) => b.tanggal <= dateTo);
    if (searchName.trim() !== "") {
      filtered = filtered.filter((b) =>
        (b.nama || b.namaPasien || "")
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }
    setFilteredBookings(filtered);
  }, [dateFrom, dateTo, searchName, bookings]);

  const toggleVerified = async (id, currentStatus) => {
    try {
      const bookingRef = doc(db, "bookingGigi", id);
      await updateDoc(bookingRef, { verified: !currentStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, verified: !currentStatus } : b))
      );
    } catch (error) {
      console.error("Gagal update verifikasi:", error);
      alert("Gagal update status verifikasi.");
    }
  };

  // Fungsi Export CSV
  const exportCSV = () => {
    if (filteredBookings.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }
    const headers = [
      "Nama",
      "Email",
      "Status",
      "Tanggal",
      "Jam",
      "Unit",
      "Tindakan",
      "Verifikasi",
    ];
    const rows = filteredBookings.map((b) => [
      b.nama || b.namaPasien || "",
      b.email,
      b.status,
      b.tanggal,
      b.jam,
      b.unit || b.unitKeluarga || "",
      b.tindakan || "",
      b.verified ? "Sudah" : "Belum",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `booking_rawat_gigi_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading data booking...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard Admin Booking Rawat Gigi
      </h1>
      <QRVerifyBooking />

      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="input"
          placeholder="Tanggal dari"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="input"
          placeholder="Tanggal sampai"
        />
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Cari nama pasien/personil"
          className="input flex-grow"
        />
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded whitespace-nowrap"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Hari</th>
            <th className="border px-4 py-2">Tanggal</th>
            <th className="border px-4 py-2">Jam</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">Tindakan</th>
            <th className="border px-4 py-2">Verifikasi</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4">
                Tidak ada data sesuai filter
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">
                  {booking.nama || booking.namaPasien || "Tamu"}
                </td>
                <td className="border px-4 py-2">{booking.email}</td>
                <td className="border px-4 py-2">{booking.status}</td>
                <td className="border px-4 py-2">{booking.hari}</td>
                <td className="border px-4 py-2">{booking.tanggal}</td>
                <td className="border px-4 py-2">{booking.jam}</td>
                <td className="border px-4 py-2">
                  {booking.unit || booking.unitKeluarga || ""}
                </td>
                <td className="border px-4 py-2">{booking.tindakan || ""}</td>
                <td className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={booking.verified || false}
                    onChange={() =>
                      toggleVerified(booking.id, booking.verified || false)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
