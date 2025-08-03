import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/signin.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Optional semi-transparent overlay for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      {/* Center the sign-in form */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SignIn />
      </div>
    </div>
  );
}
