"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import { cafeConfig } from "@/config/cafe";
import { RESERVATION_TIME_SLOTS } from "@/config/hours";
import { whatsappUrl } from "@/lib/links";
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
    time: "10:00 AM",
    guests: "2",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [formErrorSummary, setFormErrorSummary] = useState<string | null>(null);
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

  // Minimum date computed on the client after hydration in Asia/Kolkata timezone
  const [minDate, setMinDate] = useState<string>("");

  useEffect(() => {
    try {
      const kolkataNow = new Date();
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      setMinDate(formatter.format(kolkataNow));
    } catch {
      setMinDate(new Date().toISOString().split("T")[0]);
    }
  }, []);

  const timeSlots = RESERVATION_TIME_SLOTS;

  const hasConfiguredNumber = Boolean(
    cafeConfig.whatsapp || cafeConfig.contact?.whatsapp || cafeConfig.contact?.phone
  );

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
    } else if (minDate && formData.date < minDate) {
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

    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      setFormErrorSummary(`Please correct the ${errorCount} highlighted field${errorCount > 1 ? "s" : ""} below to proceed.`);
    } else {
      setFormErrorSummary(null);
    }

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
    const targetUrl = whatsappUrl(waText);

    if (targetUrl && typeof window !== "undefined") {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    setSubmittedMessage(
      "WhatsApp will open with your details filled in. The booking is confirmed only when the cafe replies."
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 rounded border border-cafe-border bg-cafe-cream-deep/40 p-6 sm:p-10"
    >
      <div className="flex flex-col gap-1 border-b border-cafe-border pb-4">
        <h3 className="font-heading text-xl font-semibold text-cafe-espresso">
          Reserve a table
        </h3>
        <p className="text-xs text-cafe-espresso/80">
          Open daily from 10:00 AM to 11:00 PM. Reservations are requested via WhatsApp.
        </p>
      </div>

      {formErrorSummary && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-[2px] border border-cafe-terracotta bg-cafe-cream p-4 text-xs font-medium text-cafe-terracotta"
        >
          <p className="font-semibold">{formErrorSummary}</p>
        </div>
      )}

      {/* Grid fields */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="text-xs font-medium text-cafe-espresso">
            Full name <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            ref={nameRef}
            id={nameId}
            type="text"
            name="name"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.name ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="text-xs text-cafe-terracotta font-medium">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={phoneId} className="text-xs font-medium text-cafe-espresso">
            Phone number <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            ref={phoneRef}
            id={phoneId}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            required
            aria-required="true"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              if (errors.phone) setErrors({ ...errors, phone: undefined });
            }}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.phone ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.phone && (
            <p id={`${phoneId}-error`} className="text-xs text-cafe-terracotta font-medium">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={dateId} className="text-xs font-medium text-cafe-espresso">
            Date <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            ref={dateRef}
            id={dateId}
            type="date"
            name="date"
            min={minDate || undefined}
            required
            aria-required="true"
            aria-invalid={errors.date ? "true" : "false"}
            aria-describedby={errors.date ? `${dateId}-error` : undefined}
            value={formData.date}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value });
              if (errors.date) setErrors({ ...errors, date: undefined });
            }}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.date ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.date && (
            <p id={`${dateId}-error`} className="text-xs text-cafe-terracotta font-medium">
              {errors.date}
            </p>
          )}
        </div>

        {/* Time slot dropdown */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={timeId} className="text-xs font-medium text-cafe-espresso">
            Time slot <span className="text-cafe-terracotta">*</span>
          </label>
          <select
            ref={timeRef}
            id={timeId}
            name="time"
            required
            aria-required="true"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="rounded border border-cafe-border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Party size */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={guestsId} className="text-xs font-medium text-cafe-espresso">
            Number of guests <span className="text-cafe-terracotta">*</span>
          </label>
          <input
            ref={guestsRef}
            id={guestsId}
            type="number"
            name="guests"
            min="1"
            max="12"
            required
            aria-required="true"
            aria-invalid={errors.guests ? "true" : "false"}
            aria-describedby={errors.guests ? `${guestsId}-error` : undefined}
            value={formData.guests}
            onChange={(e) => {
              setFormData({ ...formData, guests: e.target.value });
              if (errors.guests) setErrors({ ...errors, guests: undefined });
            }}
            className={`rounded border bg-cafe-cream px-3 py-2 text-sm text-cafe-espresso focus-visible:outline-2 focus-visible:outline-cafe-espresso ${
              errors.guests ? "border-cafe-terracotta" : "border-cafe-border"
            }`}
          />
          {errors.guests && (
            <p id={`${guestsId}-error`} className="text-xs text-cafe-terracotta font-medium">
              {errors.guests}
            </p>
          )}
        </div>

        {/* Special requests */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor={notesId} className="text-xs font-medium text-cafe-espresso">
            Special requests (optional)
          </label>
          <textarea
            id={notesId}
            name="notes"
            rows={3}
            placeholder="Dietary notes or seating preference"
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
          WhatsApp will open with your details filled in. The booking is confirmed only when the cafe replies. Read our{" "}
          <Link href="/privacy" className="text-cafe-terracotta underline underline-offset-2 hover:text-cafe-espresso">
            Privacy Policy
          </Link>
          .
        </p>

        {!hasConfiguredNumber && (
          <p className="text-xs text-cafe-olive">
            Choose the cafe&apos;s contact in WhatsApp to send it.
          </p>
        )}

        {submittedMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mt-2 w-full rounded-[2px] border border-cafe-olive/40 bg-cafe-cream p-5 text-xs text-cafe-espresso space-y-2"
          >
            <div className="flex items-center gap-2 font-heading font-semibold text-sm text-cafe-espresso">
              <span className="inline-block h-2 w-2 rounded-[1px] bg-cafe-olive" aria-hidden="true" />
              <span>Reservation Request Prepared</span>
            </div>
            <p className="leading-relaxed text-cafe-espresso/90">{submittedMessage}</p>
            <div className="rounded-[2px] border border-cafe-border bg-cafe-cream-deep/30 p-3 space-y-1 text-[11px] text-cafe-espresso">
              <p><span className="font-medium text-cafe-olive">Party:</span> {formData.guests} guests</p>
              <p><span className="font-medium text-cafe-olive">Date & Time:</span> {formData.date} at {formData.time}</p>
              <p><span className="font-medium text-cafe-olive">Name:</span> {formData.name}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmittedMessage(null);
                setFormData({
                  name: "",
                  phone: "",
                  date: "",
                  time: "10:00 AM",
                  guests: "2",
                  notes: "",
                });
              }}
              className="mt-2 inline-flex items-center text-xs font-semibold uppercase tracking-wider text-cafe-terracotta hover:underline underline-offset-2"
            >
              Start a new request
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
