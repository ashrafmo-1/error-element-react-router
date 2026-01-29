import {
    useRouteError,
    isRouteErrorResponse,
    useLocation,
} from "react-router";
import React, { useState } from "react";
import "./route-error.css";

const RouteError = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = useRouteError() as any;
    const location = useLocation();
    const [showDetails, setShowDetails] = useState(false);

    const errorData = {
        status: isRouteErrorResponse(error) ? error.status : 500,
        statusText: isRouteErrorResponse(error)
            ? error.statusText
            : "Unexpected Error",
        message: error?.message || "No message provided",
        stack: error?.stack,
        path: location.pathname,
        time: new Date().toLocaleString(),
    };

    const copyError = () => {
        navigator.clipboard.writeText(JSON.stringify(errorData, null, 2));
    };

    const is404 = errorData.status === 404;

    return (
        <div dir="ltr" className="route-error-wrapper">
            <div className="route-error-card">

                {/* Glow */}
                <div className="route-error-glow" />

                {/* Header */}
                <div className="route-error-header">
                    <div className="route-error-icon">
                        {is404 ? "🔍" : "⚠️"}
                    </div>
                    <div>
                        <h1 className="route-error-title">
                            {is404 ? "Page Not Found" : `Error ${errorData.status}`}
                        </h1>
                        <p className="route-error-subtitle">
                            {errorData.statusText}
                        </p>
                    </div>
                </div>

                {/* Message */}
                <p className="route-error-message">
                    {is404
                        ? "The page you're looking for doesn't exist or has been moved."
                        : errorData.message}
                </p>

                {/* Info Grid */}
                <div className="route-error-grid">
                    <Info label="Route" value={errorData.path} />
                    <Info label="Time" value={errorData.time} />
                    <Info label="Environment" value={import.meta.env.MODE} />
                    <Info label="User Agent" value={navigator.userAgent} />
                </div>

                {/* Actions */}
                <div className="route-error-actions">
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>

                    <Button
                        onClick={() => window.history.back()}
                        variant="secondary"
                    >
                        Go Back
                    </Button>

                    <Button
                        onClick={() => (window.location.href = "/")}
                        variant="ghost"
                    >
                        Home
                    </Button>

                    <Button
                        onClick={copyError}
                        variant="outline"
                    >
                        Copy Error
                    </Button>
                </div>

                {/* Technical Details Toggle */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="route-error-toggle"
                >
                    {showDetails ? "Hide" : "Show"} technical details
                </button>

                {/* Technical Details */}
                {showDetails && (
                    <pre className="route-error-pre">
                        {JSON.stringify(errorData, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default RouteError;

/* -------------------------------- */

const Info = ({ label, value }: { label: string; value: string }) => (
    <div className="route-error-info">
        <p className="route-error-info-label">{label}</p>
        <p className="route-error-info-value">{value}</p>
    </div>
);

const Button = ({
    children,
    onClick,
    variant = "primary",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
    return (
        <button
            onClick={onClick}
            className={`route-error-btn ${variant}`}
        >
            {children}
        </button>
    );
};
