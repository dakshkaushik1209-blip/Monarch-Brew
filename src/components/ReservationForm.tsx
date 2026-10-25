"use client";

import React, { useState, useRef, useId } from "react";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";
import { AnimatedButton } from "@/components/AnimatedButton";

interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export function ReservationForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "9:00 AM",
    guests: "2",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSelectElement>(null);
  const guestsRef = useRef<HTMLInputElement>(null);

  // Accessible unique IDs
  const nameId = useId();
  const phoneId = useId();
  const dateId = useId();
  const timeId = useId();
  const guestsId = useId();
  const notesId = useId();

  // Local minimum date (today)
  const now = new Date();
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const timeSlots = [
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
  ];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 letters).";
    }

    const cleanPhone = formData.phone.replace(/[^0-9+]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits).";
    }

    if (!formData.date) {
      newErrors.date = "Please select a reservation date.";
    } else if (formData.date < minDate) {
      newErrors.date = "Reservation date cannot be in the past.";
    }

    if (!formData.time) {
      newErrors.time = "Please select a time slot.";
    }

    const guestNum = parseInt(formData.guests, 10);
    if (isNaN(guestNum) || guestNum < 1 || guestNum > 12) {
      newErrors.guests = "Party size must be between 1 and 12 guests.";
    }

    setErrors(newErrors);

    // Focus the first erroneous input
    if (newErrors.name) {
      nameRef.current?.focus();
    } else if (newErrors.phone) {
      phoneRef.current?.focus();
    } else if (newErrors.date) {
      dateRef.current?.focus();
    } else if (newErrors.time) {
      timeRef.current?.focus();
    } else if (newErrors.guests) {
      guestsRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // NOTE: This client submit handler can be replaced with an API route POST request (e.g. /api/reservations)
    // when backend reservation persistence is introduced.

    const waNumber = cafeConfig.contact.phone.replace(/[^0-9]/g, "") || "919999999999";
    const messageLines = [
      `Hello ${cafeConfig.name}, I would like to request a table reservation:`,
      "",
      `Name: ${formData.name.trim()}`,
      `Phone: ${formData.phone.trim()}`,
      `Date: ${formData.date}`,
      `Time: ${formData.time}`,
      `Guests: ${formData.guests}`,
      formData.notes.trim() ? `Notes: ${formData.notes.trim()}` : "",
    ].filter(Boolean);

    const waText = messageLines.join("\n");
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp in a new tab safely
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }

    setSubmittedMessage(
      "Your message is ready in WhatsApp. The booking is confirmed only when the cafe replies."
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded border border-cafe-border bg-cafe-cream-deep/40 p-6 sm:p-10"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-xs font-semibold uppercase tracking-wider text-cafe-espresso">
            Full name <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            id={nameId}
            name="name"
            ref={nameRef}
            type="text"
            required
            autoComplete="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.name ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.name && (
            <span id={`${nameId}-error`} role="alert" className="text-xs text-cafe-terracotta">
              {errors.name}
            </span>
          )}
        </div>

        {/* Phone input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={phoneId} className="text-xs font-semibold uppercase tracking-wider text-cafe-espresso">
            Phone number <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            id={phoneId}
            name="phone"
            ref={phoneRef}
            type="tel"
            required
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: undefined });
            }}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.phone ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.phone && (
            <span id={`${phoneId}-error`} role="alert" className="text-xs text-cafe-terracotta">
              {errors.phone}
            </span>
          )}
        </div>

        {/* Date input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={dateId} className="text-xs font-semibold uppercase tracking-wider text-cafe-espresso">
            Date <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            id={dateId}
            name="date"
            ref={dateRef}
            type="date"
            required
            min={minDate}
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
              if (errors.date) setErrors({ ...errors, date: undefined });
            }}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? `${dateId}-error` : undefined}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.date ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.date && (
            <span id={`${dateId}-error`} role="alert" className="text-xs text-cafe-terracotta">
              {errors.date}
            </span>
          )}
        </div>

        {/* Time input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={timeId} className="text-xs font-semibold uppercase tracking-wider text-cafe-espresso">
            Time <span className="text-cafe-terracotta">*</span>
          </label>
          <select
            id={timeId}
            name="time"
            ref={timeRef}
            required
            value={formData.time}
            onChange={(e) => {
              setFormData({ ...formData, time: e.target.value });
              if (errors.time) setErrors({ ...errors, time: undefined });
            }}
            aria-invalid={!!errors.time}
            aria-describedby={errors.time ? `${timeId}-error` : undefined}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.time ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time && (
            <span id={`${timeId}-error`} role="alert" className="text-xs text-cafe-terracotta">
              {errors.time}
            </span>
          )}
        </div>

        {/* Guests input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={guestsId} className="text-xs font-semibold uppercase tracking-wider text-cafe-espresso">
            Number of guests (1 to 12) <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            id={guestsId}
            name="guests"
            ref={guestsRef}
            type="number"
            min={1}
            max={12}
            required
            value={formData.guests}
            onChange={(e) => {
              setFormData({ ...formData, guests: e.target.value });
              if (errors.guests) setErrors({ ...errors, guests: undefined });
            }}
            aria-invalid={!!errors.guests}
            aria-describedby={errors.guests ? `${guestsId}-error` : undefined}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.guests ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.guests && (
            <span id={`${guestsId}-error`} role="alert" className="text-xs text-cafe-terracotta">
              {errors.guests}
            </span>
          )}
        </div>

        {/* Optional notes */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor={notesId} className="text-xs font-semibold uppercase tracking-wider text-cafe-espresso">
            Special requests (optional)
          </label>
          <textarea
            id={notesId}
            name="notes"
            rows={3}
            placeholder="Dietary notes or high chair request"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="rounded border border-cafe-border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso"
          />
        </div>
      </div>

      {/* Action and privacy note */}
      <div className="flex flex-col items-start gap-3 border-t border-cafe-border pt-6">
        <AnimatedButton
          type="submit"
          variant="primary"
          className="w-full sm:w-auto py-3.5 px-6"
        >
          Request table via WhatsApp
        </AnimatedButton>

        <p className="text-xs text-cafe-espresso/75">
          This opens WhatsApp with your details. We do not store them on this website. Read our{" "}
          <Link href="/privacy" className="text-cafe-terracotta underline underline-offset-2 hover:text-cafe-espresso">
            Privacy Policy
          </Link>
          .
        </p>

        {submittedMessage && (
          <div
            role="status"
            className="mt-2 w-full rounded border border-cafe-border bg-cafe-cream p-4 text-xs font-medium text-cafe-espresso"
          >
            {submittedMessage}
          </div>
        )}
      </div>
    </form>
  );
}
