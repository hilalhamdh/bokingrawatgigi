import React, { useEffect, useState } from "react";
import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "../firebase";
import { Link } from "react-router-dom";
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

  const deleteBooking = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "bookingGigi", id));
      setBookings((prev) => prev.filter((b) => b.id !== id));
      alert("Data berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data.");
    }
  };

  const exportCSV = () => {
    if (filteredBookings.length === 0) {
      alert("Tidak ada data untuk diekspor");
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
    <div>
      <header className="w-full bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-4">
            <img src="/logo.jpg" className="w-10 h-10 rounded-full" />
            <Link to="/" className="text-2xl font-bold text-purple-700">
              RAWAT GITIMU
            </Link>
          </div>

          {/* Right side: Buttons */}
          <div className="flex items-center space-x-4">
            {/* Future menu / icons */}

            {/* Login Admin */}
            <Link
              to="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto mt-7 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Daftar Booking Rawat Gigi BIN
        </h1>

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
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
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
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
