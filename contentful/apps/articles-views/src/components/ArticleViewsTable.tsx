import { PageAppSDK } from "@contentful/app-sdk";
import {
    Box,
    Datepicker,
    DateTime,
    Flex,
    FormControl,
    Pagination,
    SectionHeading,
    Select,
    SkeletonRow,
    Table,
} from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";
import { useSDK } from "@contentful/react-apps-toolkit";
import { and, count, countDistinct, desc, gte, lte } from "drizzle-orm";
import { useEffect, useState } from "react";

import { db } from "../lib/db";
import { articleViewsTable, IArticleViews } from "../lib/schema";

function getDevice(device: string) {
    try {
        const data = JSON.parse(device);

        if (data.vendor && data.model) {
            return `${data.vendor} ${data.model}`;
        }
    } catch { }

    return "Unknown";
}

function getBrowser(browser: string) {
    try {
        const data = JSON.parse(browser);

        if (data.name) {
            return `${data.name} ${data.major}`;
        }
    } catch { }

    return "Unknown";
}

interface IData {
    loading: boolean;
    total: number;
    results: IArticleViews[];
    page: number;
    itemsPerPage: number;
    startDate: Date;
    endDate: Date;
    period: string;
}

const initialState: IData = {
    loading: true,
    total: 0,
    results: [],
    page: 0,
    itemsPerPage: 10,
    startDate: new Date(Date.now() - 24 * 30 * 60 * 60 * 1000),
    endDate: new Date(),
    period: "all",
}

const ArticleViewsTable = ({ refreshTs }: { refreshTs: string }) => {
    const sdk = useSDK<PageAppSDK>();

    const [data, setData] = useState(initialState);

    useEffect(() => {
        async function getData() {
            setData((prevData) => ({
                ...prevData,
                results: [],
                loading: true,
                total: 0,
            }));

            const { tursoDbUrl, tursoDbToken } = sdk.parameters?.installation || {};

            if (!tursoDbUrl || !tursoDbToken) {
                setData(prevData => ({ ...prevData, loading: false }));
                return;
            }

            const client = await db(tursoDbUrl, tursoDbToken);

            const where = [];
            if (data.period === "day") {
                where.push(
                    gte(
                        articleViewsTable.createdAt,
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                    )
                );
            } else if (data.period === "week") {
                where.push(
                    gte(
                        articleViewsTable.createdAt,
                        new Date(Date.now() - 24 * 7 * 60 * 60 * 1000)
                    )
                );
            } else if (data.period === "month") {
                where.push(
                    gte(
                        articleViewsTable.createdAt,
                        new Date(Date.now() - 24 * 30 * 60 * 60 * 1000)
                    )
                );
            } else if (data.period === "6month") {
                where.push(
                    gte(
                        articleViewsTable.createdAt,
                        new Date(Date.now() - 24 * 30 * 6 * 60 * 60 * 1000)
                    )
                );
            } else if (data.period === "year") {
                where.push(
                    gte(
                        articleViewsTable.createdAt,
                        new Date(Date.now() - 24 * 365 * 60 * 60 * 1000)
                    )
                );
            } else if (data.period === "dates" && data.startDate && data.endDate) {
                const endOfDay = new Date(data.endDate);
                endOfDay.setHours(23, 59, 59, 999);
                where.push(gte(articleViewsTable.createdAt, data.startDate));
                where.push(lte(articleViewsTable.createdAt, endOfDay));
            }

            const results = await client
                .select()
                .from(articleViewsTable)
                .where(and(...where))
                .orderBy(desc(articleViewsTable.createdAt))
                .limit(data.itemsPerPage)
                .offset(data.page * data.itemsPerPage)
                .all();

            const totalResults = await client
                .select({ total: count() })
                .from(articleViewsTable)
                .where(and(...where));

            setData((prevData) => ({
                ...prevData,
                results,
                loading: false,
                total: totalResults[0].total,
            }));
        }

        getData();
    }, [
        refreshTs,
        sdk.parameters?.installation,
        data.endDate,
        data.startDate,
        data.page,
        data.itemsPerPage,
        data.period,
    ]);

    const handleViewPerPageChange = (i: number) => {
        setData((prevData) => ({
            ...prevData,
            page: Math.floor((prevData.itemsPerPage * prevData.page + 1) / i),
            itemsPerPage: i,
        }));
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData((prevData) => ({ ...prevData, period: e.target.value }));
    };

    const handleStartDateChange = (date: Date | undefined) => {
        if (date) {
            setData((prevData) => ({ ...prevData, startDate: date }));
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        if (date) {
            setData((prevData) => ({ ...prevData, endDate: date }));
        }
    };

    const {
        loading,
        results,
        total,
        period,
        startDate,
        endDate,
        page,
        itemsPerPage,
    } = data;

    return (
        <>
            <SectionHeading>Articles views</SectionHeading>
            <Flex marginBottom="spacingM" gap="spacingM" alignItems="center">
                <FormControl>
                    <FormControl.Label>Period</FormControl.Label>
                    <Select
                        id="period"
                        name="period"
                        defaultValue="all"
                        onChange={handlePeriodChange}
                    >
                        <Select.Option value="all">All time</Select.Option>
                        <Select.Option value="day">Past day</Select.Option>
                        <Select.Option value="week">Past week</Select.Option>
                        <Select.Option value="month">Past month</Select.Option>
                        <Select.Option value="6month">Past 6 months</Select.Option>
                        <Select.Option value="year">Past year</Select.Option>
                        <Select.Option value="dates">Specific dates</Select.Option>
                    </Select>
                </FormControl>

                {period === "dates" && (
                    <>
                        <FormControl id="start-date" isRequired>
                            <FormControl.Label>Start Date</FormControl.Label>
                            <Datepicker
                                selected={startDate}
                                onSelect={handleStartDateChange}
                                toDate={new Date()}
                            />
                        </FormControl>
                        <FormControl id="end-date" isRequired>
                            <FormControl.Label>End Date</FormControl.Label>
                            <Datepicker
                                selected={endDate}
                                onSelect={handleEndDateChange}
                                toDate={new Date()}
                            />
                        </FormControl>
                    </>
                )}
            </Flex>

            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.Cell>Article</Table.Cell>
                        <Table.Cell>Country</Table.Cell>
                        <Table.Cell>Device</Table.Cell>
                        <Table.Cell>Browser</Table.Cell>
                        <Table.Cell>Date</Table.Cell>
                    </Table.Row>
                </Table.Head>

                {loading && (
                    <Table.Body>
                        <SkeletonRow columnCount={5} rowCount={20} />
                    </Table.Body>
                )}

                {!loading && (
                    <Table.Body>
                        {results?.map((row) => (
                            <Table.Row key={row.id} style={{ fontSize: tokens.fontSizeS }}>
                                <Table.Cell>{row.slug}</Table.Cell>
                                <Table.Cell>{row.country}</Table.Cell>
                                <Table.Cell>{getDevice(row.device)}</Table.Cell>
                                <Table.Cell>{getBrowser(row.browser)}</Table.Cell>
                                <Table.Cell>
                                    {row.createdAt && <DateTime date={row.createdAt} />}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                )}
            </Table>

            <Box marginTop="spacingL">
                <Pagination
                    activePage={page}
                    onPageChange={(i) =>
                        setData((prevData) => ({ ...prevData, page: i }))
                    }
                    totalItems={total}
                    showViewPerPage
                    viewPerPageOptions={[10, 25, 50, 100]}
                    itemsPerPage={itemsPerPage}
                    onViewPerPageChange={handleViewPerPageChange}
                />
            </Box>
        </>
    );
};

export default ArticleViewsTable;
