import React, { useState } from "react";
import { db, collection, addDoc } from "../firebase";

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
    jam: "",
  });

  const jamOptions = [
    "08:30-09:00",
    "09:00-09:30",
    "09:30-10:00",
    "10:00-10:30",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookingGigi"), {
        ...formData,
        verified: false, // default belum verifikasi
      });

      alert("Booking berhasil, silakan cek email Anda jika ada notifikasi.");
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
        jam: "",
      });
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi kesalahan, coba lagi nanti.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-8 space-y-4"
    >
      <h2 className="text-xl font-bold">Form Booking Rawat Gigi</h2>

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="Email Personil"
        className="input"
        required
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        type="tel"
        placeholder="No. HP Personil"
        className="input"
        required
      />

      <div>
        <label>Status:</label>
        <div className="flex gap-4 mt-1">
          <label>
            <input
              type="radio"
              name="status"
              value="Keluarga"
              checked={formData.status === "Keluarga"}
              onChange={handleChange}
              required
            />{" "}
            Keluarga
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Personil"
              checked={formData.status === "Personil"}
              onChange={handleChange}
              required
            />{" "}
            Personil
          </label>
        </div>
      </div>

      {formData.status === "Keluarga" && (
        <>
          <input
            name="namaPersonil"
            value={formData.namaPersonil}
            onChange={handleChange}
            placeholder="Nama Personil"
            className="input"
            required
          />
          <input
            name="unitKeluarga"
            value={formData.unitKeluarga}
            onChange={handleChange}
            placeholder="Unit"
            className="input"
          />
          <input
            name="namaPasien"
            value={formData.namaPasien}
            onChange={handleChange}
            placeholder="Nama Pasien"
            className="input"
            required
          />
          <input
            name="usiaPasien"
            value={formData.usiaPasien}
            onChange={handleChange}
            placeholder="Usia Pasien"
            className="input"
            type="number"
            required
          />
        </>
      )}

      {formData.status === "Personil" && (
        <>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="input"
            required
          />
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Unit"
            className="input"
          />

          <select
            name="tindakan"
            value={formData.tindakan}
            onChange={handleChange}
            className="input"
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
              className="input"
            ></textarea>
          )}
        </>
      )}

      <input
        name="tanggal"
        value={formData.tanggal}
        onChange={handleChange}
        type="date"
        className="input"
        required
      />
      <select
        name="jam"
        value={formData.jam}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Pilih Jam</option>
        {jamOptions.map((j) => (
          <option key={j} value={j}>
            {j}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Kirim Booking
      </button>
    </form>
  );
};

export default BookingForm;
