import { PageAppSDK } from "@contentful/app-sdk";
import {
    SectionHeading,
    SkeletonRow,
    Table,
} from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { sql } from "drizzle-orm";
import { useEffect, useState } from "react";

import { db } from "../lib/db";
import { articleViewsTable } from "../lib/schema";

interface IData {
    loading: boolean;
    resultCounts: {
        slug: string;
        count: number;
        percent: number;
    }[];
}

const TopArticlesTable = ({ refreshTs }: { refreshTs: string }) => {
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
                    slug: articleViewsTable.slug,
                    count: sql<number>`cast(count(${articleViewsTable.id}) as int)`,
                })
                .from(articleViewsTable)
                .groupBy(articleViewsTable.slug)
                .all();

            const total = results.reduce((acc, { count }) => acc + count, 0);

            const resultCounts = results
                .map(({ slug, count }) => ({
                    slug,
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

    return (
        <>
            <SectionHeading>Top articles</SectionHeading>

            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.Cell>Article</Table.Cell>
                        <Table.Cell>Total views</Table.Cell>
                        <Table.Cell>%</Table.Cell>
                    </Table.Row>
                </Table.Head>

                {loading ? (
                    <Table.Body>
                        <SkeletonRow columnCount={3} rowCount={10} />
                    </Table.Body>
                ) : (
                    <Table.Body>
                        {resultCounts?.map(({ slug, count, percent }) => (
                            <Table.Row key={slug}>
                                <Table.Cell>{slug}</Table.Cell>
                                <Table.Cell>{count}</Table.Cell>
                                <Table.Cell>{percent?.toFixed(1)}%</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                )}
            </Table>
        </>
    );
};

export default TopArticlesTable;
