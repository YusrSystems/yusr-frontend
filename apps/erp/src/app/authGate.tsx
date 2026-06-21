import { useSignals } from "@preact/signals-react/runtime";
import { ProtectedRoute } from "yusr-ui";
import { Services } from "@/core/services/services.ts";


export default function AuthGate()
{
	useSignals();
	return <ProtectedRoute isAuthenticated={ Services.auth.isAuthenticated }/>;
}