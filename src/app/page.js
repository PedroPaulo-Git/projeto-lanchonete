"use client";
import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Menu from "../components/menu";
import ModalAddress from "../components/modals/modalAddress";
import { useCart } from "./context/contextComponent";
export default function Home() {
  const { modalAddressOpen, setmodalAddressOpen } = useCart();

  return (
    <div>
      {modalAddressOpen && (
        <ModalAddress
          setmodalAddressOpen={setmodalAddressOpen}
          // modalAddressOpen={modalAddressOpen}
        />
      )}
      {!modalAddressOpen && (
        <div>
          <Header setmodalAddressOpen={setmodalAddressOpen} />
          <Menu setmodalAddressOpen={setmodalAddressOpen} />
          <Footer />
        </div>
      )}
    </div>
  );
}
