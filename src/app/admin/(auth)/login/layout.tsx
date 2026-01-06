export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Login page has its own layout without AuthProvider/ProtectedRoute
    // This prevents the redirect loop
    return <>{children}</>;
}
