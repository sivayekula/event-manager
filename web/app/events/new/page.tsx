"use client";
import { gql, useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";



const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  date: Yup.string().required("Date is required"),
  tagNames: Yup.string().optional(),
});

export default function NewEventPage() {
  const [createEvent, { loading }] = useMutation(CREATE_EVENT);
  const router = useRouter();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Create Event</h2>
      <Formik
        initialValues={{ title: "", date: "", tagNames: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          const tags = values.tagNames
            ? values.tagNames.split(",").map(s => s.trim()).filter(Boolean)
            : [];
          try {
            const res = await createEvent({
              variables: {
                input: {
                  title: values.title,
                  date: values.date,
                  tagNames: tags,
                  creatorId: "seeded-later" // replaced on server by seed user validation
                }
              }
            });
            const id = res.data.createEvent.id;
            router.push(`/events/${id}`);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="label">Title</label>
              <Field name="title" className="input" placeholder="Team Offsite" />
              {touched.title && errors.title ? <div className="text-sm text-red-600 mt-1">{errors.title}</div> : null}
            </div>
            <div>
              <label className="label">Date & Time</label>
              <Field name="date" type="datetime-local" className="input" />
              {touched.date && errors.date ? <div className="text-sm text-red-600 mt-1">{errors.date}</div> : null}
            </div>
            <div>
              <label className="label">Tags (comma-separated)</label>
              <Field name="tagNames" className="input" placeholder="Internal, Team Offsite" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Creating..." : "Create Event"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}