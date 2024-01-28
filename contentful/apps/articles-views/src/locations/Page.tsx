import {
  Box,
  Button,
  Grid,
  SectionHeading,
  Spinner,
  Stack,
} from "@contentful/f36-components";
import { CycleTrimmedIcon } from "@contentful/f36-icons";
import { NavList } from "@contentful/f36-navlist";
import { Workbench } from "@contentful/f36-workbench";
import { useState } from "react";

import ArticleViewsTable from "../components/ArticleViewsTable";
import BrowserViewsChart from "../components/BrowserViewsChart";
import CountryViewsChart from "../components/CountryViewsChart";
import DeviceViewsChart from "../components/DeviceViewsChart";
import TopArticlesTable from "../components/TopArticlesTable";

interface IData {
  loading: boolean;
  page: "dashboard" | "views";
  refreshTs: string;
}

const Page = () => {
  const [data, setData] = useState({
    loading: false,
    refreshTs: new Date().toISOString(),
    page: "dashboard",
  } as IData);

  const onPageRefresh = () => {
    setData(prevData => ({ ...prevData, loading: true, refreshTs: new Date().toISOString() }));

    window.setTimeout(() => {
      setData(prevData => ({ ...prevData, loading: false }));
    }, 1000);
  }


  const { refreshTs, page, loading } = data;

  return (
    <Workbench>
      <Workbench.Header
        title="Articles Views Dashboard"
        actions={[
          <Button
            key="refresh"
            variant="primary"
            size="small"
            startIcon={loading ? <Spinner /> : <CycleTrimmedIcon />}
            onClick={onPageRefresh}
            isDisabled={loading}
          >
            Refresh
          </Button>,
        ]}
      />

      <Workbench.Sidebar>
        <SectionHeading>Menu</SectionHeading>

        <NavList aria-label="Menu">
          <NavList.Item
            as="button"
            isActive={page === "dashboard"}
            onClick={() => setData(prevData => ({ ...prevData, page: "dashboard" }))}
          >
            Dashboard
          </NavList.Item>
          <NavList.Item
            as="button"
            isActive={page === "views"}
            onClick={() => setData(prevData => ({ ...prevData, page: "views" }))}
          >
            Articles views
          </NavList.Item>
        </NavList>
      </Workbench.Sidebar>

      {page === "dashboard" && (
        <Workbench.Content>
          <Stack flexDirection="column" spacing="spacingXl">
            <Box style={{ width: "100%" }}>
              <TopArticlesTable refreshTs={refreshTs} />
            </Box>

            <Grid
              style={{ width: "100%" }}
              columns="1fr 1fr 1fr"
              rowGap="spacingM"
              columnGap="spacingM"
            >
              <Grid.Item padding="spacingXs">
                <CountryViewsChart refreshTs={refreshTs} />
              </Grid.Item>
              <Grid.Item padding="spacingXs">
                <BrowserViewsChart refreshTs={refreshTs} />
              </Grid.Item>
              <Grid.Item padding="spacingXs">
                <DeviceViewsChart refreshTs={refreshTs} />
              </Grid.Item>
            </Grid>
          </Stack>
        </Workbench.Content>
      )}

      {page === "views" && (
        <Workbench.Content>
          <ArticleViewsTable refreshTs={refreshTs} />
        </Workbench.Content>
      )}
    </Workbench>
  );
};

export default Page;
