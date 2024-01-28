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

function getDevice(device: string) {
    try {
        const data = JSON.parse(device);

        if (data.vendor && data.model) {
            return `${data.vendor} ${data.model}`;
        }
    } catch { }

    return "Unknown";
}

interface IData {
    loading: boolean;
    resultCounts: {
        name: string;
        count: number;
        percent: number;
    }[];
}

const DeviceViewsChart = ({ refreshTs }: { refreshTs: string }) => {
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
                    device: articleViewsTable.device,
                    count: sql<number>`cast(count(${articleViewsTable.id}) as int)`,
                })
                .from(articleViewsTable)
                .groupBy(articleViewsTable.device)
                .all()
                .then((results) => {
                    return results
                        .map(({ device, count }) => ({ device: getDevice(device), count }))
                        .reduce((acc: { device: string; count: number }[], obj) => {
                            const device = acc.find((o) => o.device === obj.device);
                            if (device) {
                                device.count += obj.count;
                            } else {
                                acc.push({ ...obj });
                            }
                            return acc;
                        }, []);
                });

            const total = results.reduce((acc, { count }) => acc + count, 0);

            const resultCounts = results
                .map(({ device, count }) => ({
                    name: device,
                    count,
                    percent: total > 0 ? (count / total) * 100 : 0,
                }))
                .sort((a, b) => b.count - a.count);

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
            <SectionHeading>Views per Device</SectionHeading>
            <Box style={{ width: "100%", minHeight: 240 }}>
                {loading ? (
                    <Flex>
                        <Text marginRight="spacingXs">Loading</Text>
                        <Spinner />
                    </Flex>
                ) : total ? (
                    <>
                        {resultCounts?.map((device) => (
                            <ProgressBar
                                key={device.name}
                                label={device.name}
                                total={device.count}
                                percentage={device.percent}
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

export default DeviceViewsChart;
