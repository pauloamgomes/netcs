import { PageAppSDK } from "@contentful/app-sdk";
import {
    Box,
    Flex,
    SectionHeading,
    Spinner,
    Text,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { useSDK } from "@contentful/react-apps-toolkit";
import { sql } from "drizzle-orm";
import { useEffect, useState } from "react";

import { db } from "../lib/db";
import { articleViewsTable } from "../lib/schema";
import ProgressBar from "./ProgressBar";

interface IData {
    loading: boolean;
    resultCounts: {
        name: string;
        total: number;
        value: number;
    }[];
}

const CountryViewsChart = ({ refreshTs }: { refreshTs: string }) => {
    const sdk = useSDK<PageAppSDK>();

    const [data, setData] = useState({
        loading: true,
        resultCounts: [],
    } as IData);

    useEffect(() => {
        async function getData() {
            setData({ resultCounts: [], loading: true });

            const { tursoDbUrl, tursoDbToken } = sdk.parameters?.installation || {};

            if (!tursoDbUrl || !tursoDbToken) {
                setData(prevData => ({ ...prevData, loading: false }));
                return;
            }

            const client = await db(tursoDbUrl, tursoDbToken);

            const results = await client
                .select({
                    country: articleViewsTable.country,
                    count: sql<number>`cast(count(${articleViewsTable.id}) as int)`,
                })
                .from(articleViewsTable)
                .groupBy(articleViewsTable.country)
                .all();

            const total = results.reduce((acc, { count }) => acc + count, 0);

            const resultCounts = results
                .map(({ country, count }) => ({
                    name: country,
                    total: count,
                    value: total > 0 ? (count / total) * 100 : 0,
                }))
                .sort((a, b) => b.value - a.value);

            setData({
                loading: false,
                resultCounts,
            });
        }

        getData();
    }, [refreshTs, sdk.parameters?.installation]);

    const { loading, resultCounts } = data;
    const total = resultCounts?.length || 0;

    return (
        <>
            <SectionHeading>Views per Country</SectionHeading>
            <Box style={{ width: "100%", minHeight: 500 }}>
                {loading ? (
                    <Flex>
                        <Text marginRight="spacingXs">Loading</Text>
                        <Spinner />
                    </Flex>
                ) : total ? (
                    <>
                        {resultCounts?.map((country) => (
                            <ProgressBar
                                key={country.name}
                                label={country.name}
                                total={country.total}
                                percentage={country.value}
                            />
                        ))}
                    </>
                ) : (
                    <Text style={{ color: tokens.colorWarning }}>No data</Text>
                )}
            </Box>
        </>
    );
};

export default CountryViewsChart;
