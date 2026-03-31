import { Suspense } from "react";
import PaymentFailureContent from "./PaymentFailureContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}