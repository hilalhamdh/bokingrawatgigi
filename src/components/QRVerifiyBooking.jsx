import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // sesuaikan path import firebase kamu
import { QrReader } from "react-qr-reader";

const QRVerifyBooking = () => {
  const [scaResult, setScanResult] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleScan = async (result, error) => {
    if (!!result) {
      setScanResult(result?.text);
      setMessage("Memproses booking...");
      setLoading(true);
      try {
        // Asumsi QR code berisi bookingId (doc id Firestore)
        const bookingId = result.text.trim();

        const bookingRef = doc(db, "bookingGigi", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (!bookingSnap.exists()) {
          setMessage("Booking tidak ditemukan.");
          setBookingData(null);
          setLoading(false);
          return;
        }

        const data = bookingSnap.data();

        // Update verified ke true
        await updateDoc(bookingRef, { verified: true });

        setBookingData({ id: bookingId, ...data, verified: true });
        setMessage("Booking berhasil diverifikasi!");
      } catch (err) {
        console.error(err);
        setMessage("Terjadi kesalahan saat memproses booking.");
      } finally {
        setLoading(false);
      }
    }

    if (error) {
      // Optional: tampilkan error scanning
      // console.warn(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scan QR Booking</h1>

      <div className="mb-4">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      </div>

      <p className="mb-4">{message}</p>

      {loading && <p>Loading...</p>}

      {bookingData && (
        <div className="border p-4 rounded bg-green-50">
          <h2 className="font-semibold mb-2">Detail Booking</h2>
          <p>
            <strong>Nama:</strong> {bookingData.nama || bookingData.namaPasien}
          </p>
          <p>
            <strong>Email:</strong> {bookingData.email}
          </p>
          <p>
            <strong>Tanggal:</strong> {bookingData.tanggal}
          </p>
          <p>
            <strong>Jam:</strong> {bookingData.jam}
          </p>
          <p>
            <strong>Status Verifikasi:</strong>{" "}
            {bookingData.verified ? "Terverifikasi" : "Belum Terverifikasi"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRVerifyBooking;
