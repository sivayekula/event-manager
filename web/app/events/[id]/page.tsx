"use client";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { Formik, Form, Field } from "formik";

const EVENT = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      title
      date
      attendeeCount
      tags { id name }
      attendees { id name email }
    }
  }
`;

const ADD_ATTENDEE = gql`
  mutation AddAttendee($input: AddAttendeeInput!) {
    addAttendee(input: $input) {
      id
      attendeeCount
      attendees { id name email }
    }
  }
`;

const REMOVE_ATTENDEE = gql`
  mutation RemoveAttendee($eventId: ID!, $attendeeId: ID!) {
    removeAttendee(eventId: $eventId, attendeeId: $attendeeId) {
      id
      attendeeCount
      attendees { id name email }
    }
  }
`;

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data, loading, error } = useQuery(EVENT, { variables: { id } });
  const [addAttendee] = useMutation(ADD_ATTENDEE, { refetchQueries: [{ query: EVENT, variables: { id } }] });
  const [removeAttendee] = useMutation(REMOVE_ATTENDEE, { refetchQueries: [{ query: EVENT, variables: { id } }] });

  if (loading) return <div>Loading...</div>;
  if (error || !data?.event) return <div className="text-red-600">Event not found.</div>;

  const ev = data.event;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold">{ev.title}</h2>
        <p className="text-sm text-gray-600">{new Date(ev.date).toLocaleString()}</p>
        {ev.tags?.length ? (
          <div className="mt-2 flex gap-2 flex-wrap">
            {ev.tags.map((t: any) => (
              <span key={t.id} className="text-xs bg-gray-100 rounded-full px-2 py-1 border">{t.name}</span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Attendees ({ev.attendeeCount})</h3>
        <ul className="divide-y">
          {ev.attendees.map((a: any) => (
            <li key={a.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{a.name}</div>
                {a.email ? <div className="text-sm text-gray-600">{a.email}</div> : null}
              </div>
              <button
                className="btn"
                onClick={() => removeAttendee({ variables: { eventId: ev.id, attendeeId: a.id } })}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Add attendee</h4>
          <Formik
            initialValues={{ name: "", email: "" }}
            onSubmit={async (values, { resetForm }) => {
              await addAttendee({ variables: { input: { eventId: ev.id, name: values.name, email: values.email || null } } });
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="label">Name</label>
                  <Field name="name" className="input" placeholder="Jane Doe" />
                </div>
                <div className="flex-1">
                  <label className="label">Email (optional)</label>
                  <Field name="email" type="email" className="input" placeholder="jane@example.com" />
                </div>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Add</button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}