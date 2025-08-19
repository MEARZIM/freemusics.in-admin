"use client"

import { useOrigin } from "@/hooks/use-origin";
import { ApiAlert } from "./api-alert";


interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList = ({
    entityName,
    entityIdName
}: ApiListProps) => {
    const origin = useOrigin();

    const baseUrl = `${origin}/api`;

    return (
        <>
            <ApiAlert
                title={"GET"}
                description={`${baseUrl}/${entityName}`}
                variant={"public"}
            />

            <ApiAlert
                title={"GET"}
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant={"public"}
            />

            <ApiAlert
                title={"POST"}
                description={`${baseUrl}/${entityName}`}
                variant={"admin"}
            />

            <ApiAlert
                title={"PATCH"}
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant={"admin"}
            />

            <ApiAlert
                title={"DELETE"}
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
                variant={"admin"}
            />
        </>
    )
}