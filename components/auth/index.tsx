"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Auth(Component: any) {
    return function Auth(props: any) {
        let auth = false;
        useEffect(() => {
            const data = JSON.parse(sessionStorage.getItem('persist-storage') || '');
            const name = data.state.name;
            auth = !!name;
            if (!auth) {
                return redirect("/create-account");
            }
        }, []);

        return <Component {...props} />;
    };
}