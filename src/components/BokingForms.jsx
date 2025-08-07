// import React, { useState } from "react";
// import { db, collection, addDoc, query, where, getDocs } from "../firebase";
// import emailjs from "emailjs-com";
// import QRCode from "qrcode";
// import { Link } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// import { LuNotebook } from "react-icons/lu";
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
//     hari: "",
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
//     try {
//       const { tanggal, jam } = formData;

//       // Pastikan tanggal dan jam sudah dipilih
//       if (!tanggal || !jam) {
//         alert("Silakan pilih tanggal dan jam terlebih dahulu.");
//         return;
//       }
//       if (
//         formData.tindakan === "Pembersihan Karang Gigi" &&
//         formData.hari === "Kamis"
//       ) {
//         alert(
//           "Tindakan Pembersihan Karang Gigi tidak tersedia pada hari Kamis. Silakan pilih hari lain."
//         );
//         return;
//       }

//       // Cek apakah sudah ada booking pada tanggal dan jam yang sama
//       // Cek apakah jam sudah dibooking
//       const jamQuery = query(
//         collection(db, "bookingGigi"),
//         where("tanggal", "==", tanggal),
//         where("jam", "==", jam)
//       );
//       const jamSnapshot = await getDocs(jamQuery);
//       if (!jamSnapshot.empty) {
//         alert(
//           "Jam tersebut sudah dibooking oleh pasien lain. Silakan pilih jam lain."
//         );
//         return;
//       }

//       // Cek apakah jumlah booking di hari itu sudah 10
//       const bookingPerHariQuery = query(
//         collection(db, "bookingGigi"),
//         where("tanggal", "==", tanggal)
//       );
//       const bookingPerHariSnapshot = await getDocs(bookingPerHariQuery);
//       if (bookingPerHariSnapshot.size >= 10) {
//         alert("Kuota booking untuk tanggal ini sudah penuh (maks 10 orang).");
//         return;
//       }

//       // Lanjut simpan booking karena kuota & jam masih tersedia
//       await addDoc(collection(db, "bookingGigi"), formData);

//       const hari = formData.hari;

//       const templateParams = {
//         to_email: formData.email,
//         nama: formData.nama,
//         tanggal,
//         hari,
//         jam,
//         unit: formData.unit, // ✅ tambahkan ini
//         tindakan: formData.tindakan, // ✅ sudah benar
//       };

//       await emailjs.send(
//         "service_gigiperawatan", // Ganti dengan Service ID kamu
//         "template_q19q5ce", // Ganti dengan Template ID kamu
//         templateParams,
//         "ZK0z6O1bW8mG56TP-" // Ganti dengan Public Key kamu
//       );

//       alert("Booking berhasil dan email telah dikirim!");
//       alert(
//         "Jadwal yang sudah di-booking menyesuaikan kegiatan pada Unit Pusat Intelijen Medik."
//       );

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
//         tanggal: "",
//         hari: "",
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
//     <>
//       <Navbar />
//       <div
//         className="w-full min-h-screen bg-cover bg-center py-16 px-4"
//         style={{ backgroundImage: 'url("/bg.jpg")' }} // Ganti sesuai path
//       >
//         <div className="max-w-3xl md:max-w-5xl mx-auto bg-[#F0F4F8] backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#76BBDD] mb-8  tracking-wide">
//             Form Booking Poli Gigi
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6 text-gray-500">
//             {/* Email dan HP */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 type="email"
//                 placeholder="Email Personel"
//                 className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 required
//               />

//               <input
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 type="tel"
//                 placeholder="No. HP Personel"
//                 className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 required
//               />
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block font-semibold text-gray-900 mb-2">
//                 Status:
//               </label>
//               <div className="flex gap-8">
//                 {["Keluarga", "Personel"].map((status) => (
//                   <label
//                     key={status}
//                     className="flex items-center space-x-2 cursor-pointer"
//                   >
//                     <input
//                       type="radio"
//                       name="status"
//                       value={status}
//                       checked={formData.status === status}
//                       onChange={handleChange}
//                       className="appearance-none w-4 h-4 rounded-full border-2 border-[#87CEEB] checked:bg-[#87CEEB] checked:border-[#87CEEB] focus:outline-none"
//                       required
//                     />
//                     <span>{status}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Input berdasarkan status */}
//             {formData.status === "Keluarga" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <input
//                   name="namaPersonil"
//                   value={formData.namaPersonil}
//                   onChange={handleChange}
//                   placeholder="Nama Personel"
//                   className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                   required
//                 />
//                 <select
//                   name="unit"
//                   value={formData.unit}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 >
//                   <option value="">-- Pilih Unit --</option>

//                   {/* D1 - D9 */}
//                   {Array.from({ length: 9 }, (_, i) => (
//                     <option key={`D${i + 1}`} value={`D${i + 1}`}>{`D${
//                       i + 1
//                     }`}</option>
//                   ))}

//                   {/* BIRO 1 - BIRO 5 */}
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <option
//                       key={`BIRO ${i + 1}`}
//                       value={`BIRO ${i + 1}`}
//                     >{`BIRO ${i + 1}`}</option>
//                   ))}

//                   {/* PUS 1 - PUS 5 */}
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <option key={`PUS ${i + 1}`} value={`PUS ${i + 1}`}>{`PUS ${
//                       i + 1
//                     }`}</option>
//                   ))}

//                   {/* Lainnya */}
//                   <option value="Lainnya">Lainnya</option>
//                 </select>

//                 {/* Input untuk keterangan unit jika "Lainnya" */}
//                 {formData.unit === "Lainnya" && (
//                   <input
//                     type="text"
//                     name="unitKeterangan"
//                     value={formData.unitKeterangan || ""}
//                     onChange={handleChange}
//                     placeholder="Keterangan Unit"
//                     className="w-full mt-2 border border-gray-300 p-3 rounded-lg shadow-sm
//                focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                   />
//                 )}

//                 <input
//                   name="namaPasien"
//                   value={formData.namaPasien}
//                   onChange={handleChange}
//                   placeholder="Nama Pasien"
//                   className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                   required
//                 />
//                 <div className="relative w-full">
//                   <input
//                     name="usiaPasien"
//                     value={formData.usiaPasien}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="Usia Pasien"
//                     className="w-full border border-gray-300 p-3 rounded-lg shadow-sm pr-16
//       focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                     required
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
//                     tahun
//                   </span>
//                 </div>
//                 <select
//                   name="tindakan"
//                   value={formData.tindakan}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 >
//                   <option value="">-- Pilih Tindakan --</option>
//                   <option value="Pemeriksaan Gigi">Pemeriksaan Gigi</option>
//                   <option value="">Pilih Tindakan</option>
//                   <option>Pemeriksaan dan Pengobatan</option>
//                   <option>Penambalan Gigi</option>
//                   <option>Pencabutan Gigi</option>

//                   <option
//                     value="Pembersihan Karang Gigi"
//                     disabled={formData.hari === "Kamis"}
//                   >
//                     Pembersihan Karang Gigi{" "}
//                     {formData.hari === "Kamis" ? "(tidak tersedia Kamis)" : ""}
//                   </option>

//                   <option>Perawatan Saluran Akar</option>
//                   <option>Lainnya</option>
//                 </select>
//                 {formData.tindakan === "Lainnya" && (
//                   <textarea
//                     name="keterangan"
//                     value={formData.keterangan}
//                     onChange={handleChange}
//                     placeholder="Keterangan lainnya"
//                     className="md:col-span-2 border border-gray-300 p-3 rounded-lg shadow-sm"
//                   />
//                 )}
//               </div>
//             )}

//             {formData.status === "Personel" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <input
//                   name="nama"
//                   value={formData.nama}
//                   onChange={handleChange}
//                   placeholder="Nama Pasien"
//                   className="border border-gray-300 p-3 rounded-lg shadow-sm
//                  focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                   required
//                 />
//                 <div className="relative w-full">
//                   <input
//                     name="usiaPasien"
//                     value={formData.usiaPasien}
//                     onChange={handleChange}
//                     type="number"
//                     placeholder="Usia Pasien"
//                     className="w-full border border-gray-300 p-3 rounded-lg shadow-sm pr-16
//       focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                     required
//                   />
//                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
//                     tahun
//                   </span>
//                 </div>
//                 {/* Select untuk Unit */}

//                 <select
//                   name="tindakan"
//                   value={formData.tindakan}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//                  focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 >
//                   <option value="">-- Pilih Tindakan --</option>
//                   <option value="Pemeriksaan Gigi">Pemeriksaan Gigi</option>
//                   <option value="Pemeriksaan dan Pengobatan">
//                     Pemeriksaan dan Pengobatan
//                   </option>
//                   <option value="Penambalan Gigi">Penambalan Gigi</option>
//                   <option value="Pencabutan Gigi">Pencabutan Gigi</option>
//                   <option
//                     value="Pembersihan Karang Gigi"
//                     disabled={formData.hari === "Kamis"}
//                   >
//                     Pembersihan Karang Gigi{" "}
//                     {formData.hari === "Kamis" ? "(tidak tersedia Kamis)" : ""}
//                   </option>
//                   <option value="Perawatan Saluran Akar">
//                     Perawatan Saluran Akar
//                   </option>
//                   <option value="Lainnya">Lainnya</option>
//                 </select>

//                 {formData.tindakan === "Lainnya" && (
//                   <textarea
//                     name="keterangan"
//                     value={formData.keterangan}
//                     onChange={handleChange}
//                     placeholder="Keterangan lainnya"
//                     className="md:col-span-2 border border-gray-300 p-3 rounded-lg shadow-sm
//                    focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                   />
//                 )}
//                 <select
//                   name="unit"
//                   value={formData.unit}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 >
//                   <option value="">-- Pilih Unit --</option>

//                   {/* D1 - D9 */}
//                   {Array.from({ length: 9 }, (_, i) => (
//                     <option key={`D${i + 1}`} value={`D${i + 1}`}>{`D${
//                       i + 1
//                     }`}</option>
//                   ))}

//                   {/* BIRO 1 - BIRO 5 */}
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <option
//                       key={`BIRO ${i + 1}`}
//                       value={`BIRO ${i + 1}`}
//                     >{`BIRO ${i + 1}`}</option>
//                   ))}

//                   {/* PUS 1 - PUS 5 */}
//                   {Array.from({ length: 5 }, (_, i) => (
//                     <option key={`PUS ${i + 1}`} value={`PUS ${i + 1}`}>{`PUS ${
//                       i + 1
//                     }`}</option>
//                   ))}

//                   {/* Lainnya */}
//                   <option value="Lainnya">Lainnya</option>
//                 </select>

//                 {/* Input untuk keterangan unit jika "Lainnya" */}
//                 {formData.unit === "Lainnya" && (
//                   <input
//                     type="text"
//                     name="unitKeterangan"
//                     value={formData.unitKeterangan || ""}
//                     onChange={handleChange}
//                     placeholder="Keterangan Unit"
//                     className="w-full mt-2 border border-gray-300 p-3 rounded-lg shadow-sm
//                focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                   />
//                 )}
//               </div>
//             )}
//             <div className="p-1 bg-[#87CEEB] w-35 text-center rounded-sm ">
//               <Link
//                 to="/booked"
//                 className="text-white font-semibold flex items-center gap-1"
//               >
//                 Lihat Booking
//                 <LuNotebook className="text-white" />
//               </Link>
//             </div>

//             {/* Tanggal & Jam */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <input
//                 name="tanggal"
//                 placeholder="Pilih Tanggal"
//                 value={formData.tanggal}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   const selectedDate = new Date(value);
//                   const day = selectedDate.getDay();

//                   if (!isNaN(day)) {
//                     if (day >= 1 && day <= 5) {
//                       const hari = selectedDate.toLocaleDateString("id-ID", {
//                         weekday: "long",
//                       });
//                       setFormData((prev) => ({
//                         ...prev,
//                         tanggal: value,
//                         hari,
//                       }));
//                     } else {
//                       alert("Silakan pilih hari antara Senin - Jumat.");
//                       setFormData((prev) => ({
//                         ...prev,
//                         tanggal: "",
//                         hari: "",
//                       }));
//                     }
//                   } else {
//                     // Jika tanggal tidak valid
//                     setFormData((prev) => ({
//                       ...prev,
//                       tanggal: "",
//                       hari: "",
//                     }));
//                   }
//                 }}
//                 type="date"
//                 className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//                 required
//               />

//               <select
//                 name="jam"
//                 value={formData.jam}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
//              focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
//               >
//                 <option value="">Pilih Jam</option>
//                 {jamOptions.map((j) => (
//                   <option key={j} value={j}>
//                     {j}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Hari info */}
//             {formData.hari && (
//               <p className="text-sm text-gray-600 italic mt-2">
//                 Hari yang dipilih: <strong>{formData.hari}</strong>
//               </p>
//             )}

//             {/* Tombol Submit */}
//             <div className="flex justify-center mt-8">
//               <button
//                 type="submit"
//                 className="bg-[#87CEEB] hover:bg-[#76BBDD] text-[#ffff] font-bold px-6 py-3 rounded-xl shadow-lg transition duration-200"
//               >
//                 Kirim Booking
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default BookingForm;

import React, { useState, useEffect } from "react";
import { db, collection, addDoc, query, where, getDocs } from "../firebase";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LuNotebook } from "react-icons/lu";

const BookingForm = () => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("bookingFormData");
    return saved
      ? JSON.parse(saved)
      : {
          email: "",
          phone: "",
          status: "",
          namaPersonil: "",
          unitKeluarga: "",
          namaPasien: "",
          usiaPasien: "",
          nama: "",
          unit: "",
          unitKeterangan: "",
          tindakan: "",
          keterangan: "",
          tanggal: "",
          hari: "",
          jam: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("bookingFormData", JSON.stringify(formData));
  }, [formData]);

  const jamOptions = [
    "08.00-08.30",
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

  const handleTanggalChange = (e) => {
    const value = e.target.value;
    const selectedDate = new Date(value);
    const day = selectedDate.getDay();

    if (!isNaN(day)) {
      if (day >= 1 && day <= 5) {
        const hari = selectedDate.toLocaleDateString("id-ID", {
          weekday: "long",
        });
        setFormData((prev) => ({
          ...prev,
          tanggal: value,
          hari,
        }));
      } else {
        alert("Silakan pilih hari antara Senin - Jumat.");
        setFormData((prev) => ({
          ...prev,
          tanggal: "",
          hari: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        tanggal: "",
        hari: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { tanggal, jam } = formData;

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

      // Cek slot sudah dibooking
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

      // Cek kuota max 10 booking per hari
      const bookingPerHariQuery = query(
        collection(db, "bookingGigi"),
        where("tanggal", "==", tanggal)
      );
      const bookingPerHariSnapshot = await getDocs(bookingPerHariQuery);
      if (bookingPerHariSnapshot.size >= 10) {
        alert("Kuota booking untuk tanggal ini sudah penuh (maks 10 orang).");
        return;
      }

      await addDoc(collection(db, "bookingGigi"), formData);

      const templateParams = {
        to_email: formData.email,
        nama: formData.nama || formData.namaPersonil,
        tanggal,
        hari: formData.hari,
        jam,
        unit: formData.unit,
        tindakan: formData.tindakan,
      };

      await emailjs.send(
        "service_gigiperawatan",
        "template_q19q5ce",
        templateParams,
        "ZK0z6O1bW8mG56TP-"
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
        unitKeterangan: "",
        tindakan: "",
        keterangan: "",
        tanggal: "",
        hari: "",
        jam: "",
      });
      localStorage.removeItem("bookingFormData");
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
        style={{ backgroundImage: 'url("/bg.jpg")' }}
      >
        <div className="max-w-3xl md:max-w-5xl mx-auto bg-[#F0F4F8] backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#76BBDD] mb-8 tracking-wide">
            Form Booking Poli Gigi
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 text-gray-500">
            {/* Email dan HP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Personel"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                required
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="No. HP Personel"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-semibold text-gray-900 mb-2">
                Status:
              </label>
              <div className="flex gap-8">
                {["Keluarga", "Personel"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                      className="appearance-none w-4 h-4 rounded-full border-2 border-[#87CEEB] checked:bg-[#87CEEB] checked:border-[#87CEEB] focus:outline-none"
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
                  placeholder="Nama Personel"
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                  required
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                >
                  <option value="">-- Pilih Unit --</option>

                  {Array.from({ length: 9 }, (_, i) => (
                    <option key={`D${i + 1}`} value={`D${i + 1}`}>
                      {`D${i + 1}`}
                    </option>
                  ))}

                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={`BIRO ${i + 1}`} value={`BIRO ${i + 1}`}>
                      {`BIRO ${i + 1}`}
                    </option>
                  ))}

                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={`PUS ${i + 1}`} value={`PUS ${i + 1}`}>
                      {`PUS ${i + 1}`}
                    </option>
                  ))}

                  <option value="Lainnya">Lainnya</option>
                </select>

                {formData.unit === "Lainnya" && (
                  <input
                    type="text"
                    name="unitKeterangan"
                    value={formData.unitKeterangan || ""}
                    onChange={handleChange}
                    placeholder="Keterangan Unit"
                    className="w-full mt-2 border border-gray-300 p-3 rounded-lg shadow-sm
               focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                  />
                )}

                <input
                  name="namaPasien"
                  value={formData.namaPasien}
                  onChange={handleChange}
                  placeholder="Nama Pasien"
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                  required
                />
                <div className="relative w-full">
                  <input
                    name="usiaPasien"
                    value={formData.usiaPasien}
                    onChange={handleChange}
                    type="number"
                    placeholder="Usia Pasien"
                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm pr-16
      focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    tahun
                  </span>
                </div>
                <select
                  name="tindakan"
                  value={formData.tindakan}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                >
                  <option value="">-- Pilih Tindakan --</option>
                  <option value="Pemeriksaan Gigi">Pemeriksaan Gigi</option>
                  <option value="Pemeriksaan dan Pengobatan">
                    Pemeriksaan dan Pengobatan
                  </option>
                  <option value="Penambalan Gigi">Penambalan Gigi</option>
                  <option value="Pencabutan Gigi">Pencabutan Gigi</option>
                  <option
                    value="Pembersihan Karang Gigi"
                    disabled={formData.hari === "Kamis"}
                  >
                    Pembersihan Karang Gigi{" "}
                    {formData.hari === "Kamis" ? "(tidak tersedia Kamis)" : ""}
                  </option>
                  <option value="Perawatan Saluran Akar">
                    Perawatan Saluran Akar
                  </option>
                  <option value="Lainnya">Lainnya</option>
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

            {formData.status === "Personel" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama Pasien"
                  className="border border-gray-300 p-3 rounded-lg shadow-sm
                 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                  required
                />
                <div className="relative w-full">
                  <input
                    name="usiaPasien"
                    value={formData.usiaPasien}
                    onChange={handleChange}
                    type="number"
                    placeholder="Usia Pasien"
                    className="w-full border border-gray-300 p-3 rounded-lg shadow-sm pr-16
      focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    tahun
                  </span>
                </div>

                <select
                  name="tindakan"
                  value={formData.tindakan}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
                 focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                >
                  <option value="">-- Pilih Tindakan --</option>
                  <option value="Pemeriksaan Gigi">Pemeriksaan Gigi</option>
                  <option value="Pemeriksaan dan Pengobatan">
                    Pemeriksaan dan Pengobatan
                  </option>
                  <option value="Penambalan Gigi">Penambalan Gigi</option>
                  <option value="Pencabutan Gigi">Pencabutan Gigi</option>
                  <option
                    value="Pembersihan Karang Gigi"
                    disabled={formData.hari === "Kamis"}
                  >
                    Pembersihan Karang Gigi{" "}
                    {formData.hari === "Kamis" ? "(tidak tersedia Kamis)" : ""}
                  </option>
                  <option value="Perawatan Saluran Akar">
                    Perawatan Saluran Akar
                  </option>
                  <option value="Lainnya">Lainnya</option>
                </select>

                {formData.tindakan === "Lainnya" && (
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleChange}
                    placeholder="Keterangan lainnya"
                    className="md:col-span-2 border border-gray-300 p-3 rounded-lg shadow-sm
                   focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                  />
                )}
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                >
                  <option value="">-- Pilih Unit --</option>

                  {Array.from({ length: 9 }, (_, i) => (
                    <option key={`D${i + 1}`} value={`D${i + 1}`}>
                      {`D${i + 1}`}
                    </option>
                  ))}

                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={`BIRO ${i + 1}`} value={`BIRO ${i + 1}`}>
                      {`BIRO ${i + 1}`}
                    </option>
                  ))}

                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={`PUS ${i + 1}`} value={`PUS ${i + 1}`}>
                      {`PUS ${i + 1}`}
                    </option>
                  ))}

                  <option value="Lainnya">Lainnya</option>
                </select>

                {formData.unit === "Lainnya" && (
                  <input
                    type="text"
                    name="unitKeterangan"
                    value={formData.unitKeterangan || ""}
                    onChange={handleChange}
                    placeholder="Keterangan Unit"
                    className="w-full mt-2 border border-gray-300 p-3 rounded-lg shadow-sm
               focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                  />
                )}
              </div>
            )}
            <div className="p-1 bg-[#87CEEB] w-35 text-center rounded-sm mt-6">
              <Link
                to="/booked"
                className="text-white font-semibold flex items-center gap-1 justify-center"
              >
                Lihat Booking <LuNotebook className="text-white" />
              </Link>
            </div>
            {/* Tanggal & Jam */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="tanggal"
                placeholder="Pilih Tanggal"
                value={formData.tanggal}
                onChange={handleTanggalChange}
                type="date"
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
                required
              />

              <select
                name="jam"
                value={formData.jam}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg shadow-sm
             focus:ring-2 focus:ring-[#87CEEB] focus:border-[#87CEEB] outline-none"
              >
                <option value="">Pilih Jam</option>
                {jamOptions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {formData.hari && (
              <p className="text-sm text-gray-600 italic mt-2">
                Hari yang dipilih: <strong>{formData.hari}</strong>
              </p>
            )}

            {/* Tombol Submit */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="bg-[#87CEEB] hover:bg-[#76BBDD] text-white font-bold px-6 py-3 rounded-xl shadow-lg transition duration-200"
              >
                Kirim Booking
              </button>
            </div>
          </form>

          {/* Link ke halaman booking */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingForm;
