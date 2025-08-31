import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "../firebase";
import { Link } from "react-router-dom";
import Footer from "./Footer";
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
      "Nomor WA",
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
      b.nomorWa || b.wa || "", // ambil nomor WA
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
  // Normalisasi nomor WA
  // Cek apakah nomor WA valid (Indonesia)
  const isValidWA = (number) => {
    if (!number) return false;
    const num = number.toString().replace(/\D/g, "");
    return /^(0|62)[0-9]{8,}$/g.test(num);
  };

  const formatWA = (number) => {
    if (!number) return null;
    let num = number.toString().replace(/\D/g, "");
    if (num.startsWith("0")) num = "62" + num.slice(1);
    if (!num.startsWith("62")) num = "62" + num;
    return num;
  };

  const getWaLink = (number, booking) => {
    const formattedNumber = formatWA(number);
    if (!formattedNumber) return "#";

    const text =
      `Halo ${booking.nama || "Pasien"}\n` +
      `Booking Anda di Poli Gigi sudah dikonfirmasi\n\n` +
      `Tanggal: ${booking.tanggal}\n` +
      `Jam: ${booking.jam}\n` +
      `Unit: ${booking.unit || booking.unitKeluarga || ""}\n\n` +
      `Mohon konfirmasi kehadiran Anda dengan membalas HADIR atau TIDAK HADIR. Terima Kasih`;

    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(text)}`;
  };

  const getSmsLink = (number, booking) => {
    if (!number) return "#";

    // Normalisasi nomor
    let num = number.toString().replace(/\D/g, ""); // hapus non-digit
    if (num.startsWith("0")) num = "62" + num.slice(1); // ubah 0 jadi kode negara

    // Pesan
    const text =
      `Halo ${
        booking.nama || "Pasien"
      }, booking Anda di Poli Gigi sudah dikonfirmasi.\n` +
      `Tanggal: ${booking.tanggal}\n` +
      `Jam: ${booking.jam}\n` +
      `Unit: ${booking.unit || booking.unitKeluarga || ""}\n` +
      `Mohon balas HADIR atau TIDAK HADIR. Terima kasih.`;

    return `sms:${num}?body=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    let filtered = [...bookings];

    if (dateFrom) filtered = filtered.filter((b) => b.tanggal >= dateFrom);
    if (dateTo) filtered = filtered.filter((b) => b.tanggal <= dateTo);
    if (searchName.trim() !== "") {
      filtered = filtered.filter((b) =>
        (b.nama || b.namaPasien || "")
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    // Parse tanggal dan sort ascending
    const parseDate = (str) => {
      const [y, m, d] = str.split("-"); // sesuaikan format tanggal di Firestore
      return new Date(`${y}-${m}-${d}`);
    };

    filtered.sort((a, b) => parseDate(a.tanggal) - parseDate(b.tanggal));

    setFilteredBookings(filtered);
  }, [dateFrom, dateTo, searchName, bookings]);

  const [selectedTemplate, setSelectedTemplate] = useState({});
  if (loading) return <p>Loading data booking...</p>;

  return (
    <div>
      <div
        className="w-full min-h-screen bg-cover bg-center  "
        style={{ backgroundImage: 'url("/bgg.jpg")' }} // Ganti sesuai path
      >
        <header className="w-full  bg-white shadow-xl border-b-3 border-gray-300">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center ">
            <div className="flex gap-4">
              <img src="/logo.jpg" className="w-10 h-10 rounded-full" />
              <Link to="/" className="text-2xl font-bold text-[#76BBDD]">
                RAWAT GIGIMU
              </Link>
            </div>

            {/* Right side: Buttons */}
            <div className="flex items-center space-x-4">
              {/* Future menu / icons */}

              {/* Login Admin */}
              <Link
                to="/"
                className="bg-[#87CEEB] hover:bg-[#76BBDD] text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Logout
              </Link>
            </div>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto  p-4 mt-5 bg-white">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center text-[#76BBDD] pb-4">
            Daftar Booking Poli Gigi
          </h1>

          {/* Filter */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tanggal dari
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full sm:w-auto min-w-[150px] border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none 
             bg-white text-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Tanggal sampai
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full sm:w-auto min-w-[150px] border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none
             bg-white text-gray-700"
              />
            </div>

            <div className="flex flex-col flex-grow min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Cari nama
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Cari nama pasien/personel"
                className="w-full bg-white border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none
             text-gray-700"
              />
            </div>
            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto text-center"
            >
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto text-gray-700">
            <table className="min-w-full border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Nama</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Konfirmasi</th>{" "}
                  {/* Kolom baru */}
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
                      <td className="border py-2 text-center gap-2">
                        {booking.phone || booking.wa ? (
                          isValidWA(booking.phone || booking.wa) ? (
                            <a
                              href={getWaLink(
                                booking.phone || booking.wa,
                                booking
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 text-green-600 hover:underline mt-1"
                            >
                              <FaWhatsapp className="text-green-500 text-sm" />
                              <p>WhatsApp</p>
                            </a>
                          ) : (
                            <a
                              href={getSmsLink(
                                booking.phone || booking.wa,
                                booking
                              )}
                              className="flex items-center justify-center gap-2 text-blue-600 hover:underline mt-1"
                            >
                              <p>SMS</p>
                            </a>
                          )
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      <td className="border px-4 py-2">{booking.status}</td>
                      <td className="border px-4 py-2">{booking.hari}</td>
                      <td className="border px-4 py-2">{booking.tanggal}</td>
                      <td className="border px-4 py-2">{booking.jam}</td>
                      <td className="border px-4 py-2">
                        {booking.unit || booking.unitKeluarga || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {booking.tindakan || ""}
                      </td>
                      <td className="border px-4 py-2 text-center bg-white">
                        <label className="inline-flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-[#87CEEB]  rounded focus:ring-2 focus:ring-[#87CEEB] "
                            checked={booking.verified || false}
                            onChange={() =>
                              toggleVerified(
                                booking.id,
                                booking.verified || false
                              )
                            }
                          />
                        </label>
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
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
