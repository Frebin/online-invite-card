import { useState } from "react";
import { Check, Send } from "lucide-react";

const initialForm = { name: "", email: "", attendance: "", wishes: "" };

export default function RSVP() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.attendance) {
      setError("Please add your name, email, and attendance.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rsvp-success">
        <Check size={28} />
        <h3>Thank you, {form.name.split(" ")[0]}.</h3>
        <p>Your reply has been tucked away. We look forward to seeing you.</p>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={submit} noValidate>
      <label>
        Full name
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Your name"
        />
      </label>
      <label>
        Email address
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
        />
      </label>
      <fieldset>
        <legend>Will you join us?</legend>
        <div className="attendance-options">
          <label className={form.attendance === "joyfully" ? "selected" : ""}>
            <input
              type="radio"
              name="attendance"
              value="joyfully"
              checked={form.attendance === "joyfully"}
              onChange={updateField}
            />{" "}
            Joyfully accepts
          </label>
          <label
            className={form.attendance === "regretfully" ? "selected" : ""}
          >
            <input
              type="radio"
              name="attendance"
              value="regretfully"
              checked={form.attendance === "regretfully"}
              onChange={updateField}
            />{" "}
            Regretfully declines
          </label>
        </div>
      </fieldset>
      <label>
        A note for the couple
        <textarea
          name="wishes"
          value={form.wishes}
          onChange={updateField}
          rows="3"
          placeholder="A little note or wishes..."
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button--dark" type="submit">
        Send <Send size={15} />
      </button>
    </form>
  );
}
