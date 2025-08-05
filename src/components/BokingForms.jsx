// // BookingForm.jsx
// import React, { useState } from "react";
// import { db, collection, addDoc } from "../firebase";
// import emailjs from "emailjs-com";
// import QRCode from "qrcode";
// import { Link } from "react-router-dom";

// const BookingForm = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     phone: "",
//     status: "",
//     namaPersonil: "",
//     unitKeluarga: "",
//     namaPasien: "",
//     usiaPasien: "",
//     nama: "",
//     unit: "",
//     tindakan: "",
//     keterangan: "",
//     tanggal: "",
//     jam: "",
//   });

//   const jamOptions = [
//     "08:30-09:00",
//     "09:00-09:30",
//     "09:30-10:00",
//     "10:00-10:30",
//     "10:30-11:00",
//     "11:00-11:30",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validasi sederhana tambahan bisa ditambahkan di sini jika perlu

//     try {
//       // Simpan data booking ke Firestore
//       await addDoc(collection(db, "bookingGigi"), formData);

//       // Hitung hari dari tanggal booking
//       const hari = new Date(formData.tanggal).toLocaleDateString("id-ID", {
//         weekday: "long",
//       });

//       // Buat data QR code dalam bentuk string
//       const qrData = `Nama: ${formData.nama || formData.namaPasien}\nTanggal: ${
//         formData.tanggal
//       } (${hari})\nJam: ${formData.jam}`;

//       // Generate QR code berupa data URL base64
//       const barcode = await QRCode.toDataURL(qrData);

//       // Siapkan parameter template untuk EmailJS
//       const templateParams = {
//         to_email: formData.email,
//         nama: formData.nama || formData.namaPasien || "Tamu",
//         tanggal: formData.tanggal,
//         hari,
//         jam: formData.jam,
//         barcode,
//       };

//       // Kirim email dengan EmailJS
//       await emailjs.send(
//         "service_gigiperawatan", // Ganti dengan Service ID kamu
//         "template_q19q5ce", // Ganti dengan Template ID kamu
//         templateParams,
//         "ZK0z6O1bW8mG56TP-" // Ganti dengan Public Key kamu
//       );

//       alert("Booking berhasil dan email telah dikirim!");
//       alert(
//         "Jadwal yang sudah di Booking menyesuaikan kegiatan yang ada pada Unit Pusat Intelijen Medik.!"
//       );
//       // Reset form setelah submit
//       setFormData({
//         email: "",
//         phone: "",
//         status: "",
//         namaPersonil: "",
//         unitKeluarga: "",
//         namaPasien: "",
//         usiaPasien: "",
//         nama: "",
//         unit: "",
//         tindakan: "",
//         keterangan: "",
//         hari: "",
//         tanggal: "",
//         jam: "",
//       });
//     } catch (error) {
//       console.error("Gagal saat proses booking atau kirim email:", error);
//       alert(
//         "Terjadi kesalahan saat booking atau mengirim email, coba lagi nanti."
//       );
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-lg border">
//       <Link to="/login">Login Admin</Link>
//       <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
//         Form Booking Rawat Gigi
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             type="email"
//             placeholder="Email Personil"
//             className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//             required
//           />
//           <input
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             type="tel"
//             placeholder="No. HP Personil"
//             className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Status:</label>
//           <div className="flex gap-6">
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="status"
//                 value="Keluarga"
//                 checked={formData.status === "Keluarga"}
//                 onChange={handleChange}
//                 className="mr-2"
//                 required
//               />
//               Keluarga
//             </label>
//             <label className="inline-flex items-center">
//               <input
//                 type="radio"
//                 name="status"
//                 value="Personil"
//                 checked={formData.status === "Personil"}
//                 onChange={handleChange}
//                 className="mr-2"
//                 required
//               />
//               Personil
//             </label>
//           </div>
//         </div>

//         {formData.status === "Keluarga" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               name="namaPersonil"
//               value={formData.namaPersonil}
//               onChange={handleChange}
//               placeholder="Nama Personil"
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//               required
//             />
//             <input
//               name="unitKeluarga"
//               value={formData.unitKeluarga}
//               onChange={handleChange}
//               placeholder="Unit"
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//             />
//             <input
//               name="namaPasien"
//               value={formData.namaPasien}
//               onChange={handleChange}
//               placeholder="Nama Pasien"
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//               required
//             />
//             <input
//               name="usiaPasien"
//               value={formData.usiaPasien}
//               onChange={handleChange}
//               placeholder="Usia Pasien"
//               type="number"
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//               required
//             />
//           </div>
//         )}

//         {formData.status === "Personil" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input
//               name="nama"
//               value={formData.nama}
//               onChange={handleChange}
//               placeholder="Nama"
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//               required
//             />
//             <input
//               name="unit"
//               value={formData.unit}
//               onChange={handleChange}
//               placeholder="Unit"
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//             />

//             <select
//               name="tindakan"
//               value={formData.tindakan}
//               onChange={handleChange}
//               className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//               required
//             >
//               <option value="">Pilih Tindakan</option>
//               <option>Pemeriksaan dan Pengobatan</option>
//               <option>Penambalan Gigi</option>
//               <option>Pencabutan Gigi</option>
//               <option>Pembersihan Karang Gigi</option>
//               <option>Perawatan Saluran Akar</option>
//               <option>Lainnya</option>
//             </select>

//             {formData.tindakan === "Lainnya" && (
//               <textarea
//                 name="keterangan"
//                 value={formData.keterangan}
//                 onChange={handleChange}
//                 placeholder="Keterangan lainnya"
//                 className="input border border-gray-300 p-3 rounded-lg shadow-sm col-span-2"
//               ></textarea>
//             )}
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             name="tanggal"
//             value={formData.tanggal}
//             onChange={(e) => {
//               const selectedDate = new Date(e.target.value);
//               const day = selectedDate.getDay(); // 0: Minggu, 1: Senin, ..., 6: Sabtu

//               if (day >= 1 && day <= 5) {
//                 const dayName = selectedDate.toLocaleDateString("id-ID", {
//                   weekday: "long",
//                 });
//                 setFormData((prev) => ({
//                   ...prev,
//                   tanggal: e.target.value,
//                   hari: dayName,
//                 }));
//               } else {
//                 alert("Silakan pilih tanggal antara hari Senin sampai Jumat.");
//                 setFormData((prev) => ({ ...prev, tanggal: "", hari: "" }));
//               }
//             }}
//             type="date"
//             className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//             required
//           />

//           {/* Tampilkan hari yang dipilih */}
//           {formData.hari && (
//             <p className="text-sm text-gray-700 mt-2">Hari: {formData.hari}</p>
//           )}

//           <select
//             name="jam"
//             value={formData.jam}
//             onChange={handleChange}
//             className="input border border-gray-300 p-3 rounded-lg shadow-sm"
//             required
//           >
//             <option value="">Pilih Jam</option>
//             {jamOptions.map((j) => (
//               <option key={j} value={j}>
//                 {j}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex justify-center mt-6">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-xl shadow-md"
//           >
//             Kirim Booking
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BookingForm;

// BookingForm.jsx
import React, { useState } from "react";
import { db, collection, addDoc, query, where, getDocs } from "../firebase";
import emailjs from "emailjs-com";
import QRCode from "qrcode";
import { Link } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-lg border">
      <Link to="/login">Login Admin</Link>
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Form Booking Rawat Gigi
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email dan HP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email Personil"
            className="input border border-gray-300 p-3 rounded-lg shadow-sm"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="No. HP Personil"
            className="input border border-gray-300 p-3 rounded-lg shadow-sm"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-1">Status:</label>
          <div className="flex gap-6">
            {["Keluarga", "Personil"].map((status) => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* Input berdasarkan status */}
        {formData.status === "Keluarga" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="namaPersonil"
              value={formData.namaPersonil}
              onChange={handleChange}
              placeholder="Nama Personil"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
              required
            />
            <input
              name="unitKeluarga"
              value={formData.unitKeluarga}
              onChange={handleChange}
              placeholder="Unit"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
            />
            <input
              name="namaPasien"
              value={formData.namaPasien}
              onChange={handleChange}
              placeholder="Nama Pasien"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
              required
            />
            <input
              name="usiaPasien"
              value={formData.usiaPasien}
              onChange={handleChange}
              type="number"
              placeholder="Usia Pasien"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
              required
            />
            <select
              name="tindakan"
              value={formData.tindakan}
              onChange={handleChange}
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
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
                className="input border border-gray-300 p-3 rounded-lg shadow-sm col-span-2"
              ></textarea>
            )}
          </div>
        )}

        {formData.status === "Personil" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Nama"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
              required
            />
            <input
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Unit"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
            />
            <select
              name="tindakan"
              value={formData.tindakan}
              onChange={handleChange}
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
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
                className="input border border-gray-300 p-3 rounded-lg shadow-sm col-span-2"
              ></textarea>
            )}
          </div>
        )}

        {/* Tanggal & Jam */}
        <div>
          {formData.hari && (
            <p className="text-sm text-gray-700">Hari: {formData.hari}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="tanggal"
              value={formData.tanggal}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const day = selectedDate.getDay(); // 1: Senin, ..., 5: Jumat
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
                  alert(
                    "Silakan pilih tanggal antara hari Senin sampai Jumat."
                  );
                  setFormData((prev) => ({ ...prev, tanggal: "", hari: "" }));
                }
              }}
              type="date"
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
              required
            />

            <select
              name="jam"
              value={formData.jam}
              onChange={handleChange}
              className="input border border-gray-300 p-3 rounded-lg shadow-sm"
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
        </div>

        {/* Hari */}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-xl shadow-md"
          >
            Kirim Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
