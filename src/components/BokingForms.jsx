import React, { useState } from "react";
import { db, collection, addDoc, query, where, getDocs } from "../firebase";
import emailjs from "emailjs-com";
import QRCode from "qrcode";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    status: "",
    namaPersonil: "",
    unitKeluarga: "",
    namaPasien: "",
    usiaPasien: "",
    nama: "",
    unit: "",
    tindakan: "",
    keterangan: "",
    tanggal: "",
    hari: "",
    jam: "",
  });

  const jamOptions = [
    "08:30-09:00",
    "09:00-09:30",
    "09:30-10:00",
    "10:00-10:30",
    "10:30-11:00",
    "11:00-11:30",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { tanggal, jam } = formData;

      // Pastikan tanggal dan jam sudah dipilih
      if (!tanggal || !jam) {
        alert("Silakan pilih tanggal dan jam terlebih dahulu.");
        return;
      }
      if (
        formData.tindakan === "Pembersihan Karang Gigi" &&
        formData.hari === "Kamis"
      ) {
        alert(
          "Tindakan Pembersihan Karang Gigi tidak tersedia pada hari Kamis. Silakan pilih hari lain."
        );
        return;
      }

      // Cek apakah sudah ada booking pada tanggal dan jam yang sama
      // Cek apakah jam sudah dibooking
      const jamQuery = query(
        collection(db, "bookingGigi"),
        where("tanggal", "==", tanggal),
        where("jam", "==", jam)
      );
      const jamSnapshot = await getDocs(jamQuery);
      if (!jamSnapshot.empty) {
        alert(
          "Jam tersebut sudah dibooking oleh pasien lain. Silakan pilih jam lain."
        );
        return;
      }

      // Cek apakah jumlah booking di hari itu sudah 10
      const bookingPerHariQuery = query(
        collection(db, "bookingGigi"),
        where("tanggal", "==", tanggal)
      );
      const bookingPerHariSnapshot = await getDocs(bookingPerHariQuery);
      if (bookingPerHariSnapshot.size >= 10) {
        alert("Kuota booking untuk tanggal ini sudah penuh (maks 10 orang).");
        return;
      }

      // Lanjut simpan booking karena kuota & jam masih tersedia
      await addDoc(collection(db, "bookingGigi"), formData);

      const hari = formData.hari;

      const qrData = `Nama: ${
        formData.nama || formData.namaPasien
      }\nTanggal: ${tanggal} (${hari})\nJam: ${jam}`;
      const barcode = await QRCode.toDataURL(qrData);

      const templateParams = {
        to_email: formData.email,
        nama: formData.nama || formData.namaPasien || "Tamu",
        tanggal,
        hari,
        jam,
        barcode,
      };

      await emailjs.send(
        "service_gigiperawatan", // Ganti dengan Service ID kamu
        "template_q19q5ce", // Ganti dengan Template ID kamu
        templateParams,
        "ZK0z6O1bW8mG56TP-" // Ganti dengan Public Key kamu
      );

      alert("Booking berhasil dan email telah dikirim!");
      alert(
        "Jadwal yang sudah di-booking menyesuaikan kegiatan pada Unit Pusat Intelijen Medik."
      );

      setFormData({
        email: "",
        phone: "",
        status: "",
        namaPersonil: "",
        unitKeluarga: "",
        namaPasien: "",
        usiaPasien: "",
        nama: "",
        unit: "",
        tindakan: "",
        keterangan: "",
        tanggal: "",
        hari: "",
        jam: "",
      });
    } catch (error) {
      console.error("Gagal saat proses booking atau kirim email:", error);
      alert(
        "Terjadi kesalahan saat booking atau mengirim email, coba lagi nanti."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="w-full min-h-screen bg-cover bg-center py-16 px-4"
        style={{ backgroundImage: 'url("/bg.jpg")' }} // Ganti sesuai path
      >
        <div className="max-w-3xl md:max-w-5xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-8 drop-shadow">
            Form Booking Rawat Gigi
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email dan HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Personil"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="No. HP Personil"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Status:
              </label>
              <div className="flex gap-8">
                {["Keluarga", "Personil"].map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      className="accent-purple-600"
                      required
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Input berdasarkan status */}
            {formData.status === "Keluarga" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="namaPersonil"
                  value={formData.namaPersonil}
                  onChange={handleChange}
                  placeholder="Nama Personil"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  name="unitKeluarga"
                  value={formData.unitKeluarga}
                  onChange={handleChange}
                  placeholder="Unit"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm"
                />
                <input
                  name="namaPasien"
                  value={formData.namaPasien}
                  onChange={handleChange}
                  placeholder="Nama Pasien"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  name="usiaPasien"
                  value={formData.usiaPasien}
                  onChange={handleChange}
                  type="number"
                  placeholder="Usia Pasien"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm"
                  required
                />
                <select
                  name="tindakan"
                  value={formData.tindakan}
                  onChange={handleChange}
                  required
                  className="border rounded-md p-2 w-full"
                >
                  <option value="">-- Pilih Tindakan --</option>
                  <option value="Pemeriksaan Gigi">Pemeriksaan Gigi</option>
                  <option
                    value="Pembersihan Karang Gigi"
                    disabled={formData.hari === "Kamis"}
                  >
                    Pembersihan Karang Gigi{" "}
                    {formData.hari === "Kamis" ? "(tidak tersedia Kamis)" : ""}
                  </option>
                  <option value="Tambal Gigi">Tambal Gigi</option>
                </select>
                {formData.tindakan === "Lainnya" && (
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    placeholder="Keterangan lainnya"
                    className="md:col-span-2 border border-gray-300 p-3 rounded-lg shadow-sm"
                  />
                )}
              </div>
            )}

            {formData.status === "Personil" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="Unit"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm"
                />
                <select
                  name="tindakan"
                  value={formData.tindakan}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg shadow-sm"
                  required
                >
                  <option value="">Pilih Tindakan</option>
                  <option>Pemeriksaan dan Pengobatan</option>
                  <option>Penambalan Gigi</option>
                  <option>Pencabutan Gigi</option>
                  <option>Pembersihan Karang Gigi</option>
                  <option>Perawatan Saluran Akar</option>
                  <option>Lainnya</option>
                </select>
                {formData.tindakan === "Lainnya" && (
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    placeholder="Keterangan lainnya"
                    className="md:col-span-2 border border-gray-300 p-3 rounded-lg shadow-sm"
                  />
                )}
              </div>
            )}

            {/* Tanggal & Jam */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="tanggal"
                value={formData.tanggal}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const day = selectedDate.getDay();
                  if (day >= 1 && day <= 5) {
                    const hari = selectedDate.toLocaleDateString("id-ID", {
                      weekday: "long",
                    });
                    setFormData((prev) => ({
                      ...prev,
                      tanggal: e.target.value,
                      hari,
                    }));
                  } else {
                    alert("Silakan pilih hari antara Senin - Jumat.");
                    setFormData((prev) => ({ ...prev, tanggal: "", hari: "" }));
                  }
                }}
                type="date"
                className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
                required
              />
              <select
                name="jam"
                value={formData.jam}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg shadow-sm"
                required
              >
                <option value="">Pilih Jam</option>
                {jamOptions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Hari info */}
            {formData.hari && (
              <p className="text-sm text-gray-600 italic mt-2">
                Hari yang dipilih: <strong>{formData.hari}</strong>
              </p>
            )}

            {/* Tombol Submit */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition duration-200"
              >
                Kirim Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
