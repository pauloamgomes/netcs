import { Box, Text } from "@contentful/f36-components";
import tokens from "@contentful/f36-tokens";

const ProgressBar = ({
    label,
    total,
    percentage,
}: {
    label: string;
    total: number;
    percentage: number;
}) => {
    return (
        <Box style={{ height: 30, width: '100%', marginBottom: 5, position: "relative", backgroundColor: tokens.gray100 }}>
            <Text
                fontSize="fontSizeS"
                color="colorBlack"
                style={{
                    position: "absolute",
                    textAlign: "right",
                    right: 0,
                    minWidth: "100px",
                    padding: "4px 8px",
                }}
            >{total}</Text>

            <div
                style={{
                    position: "relative",
                    height: 30,
                    width: `${percentage}%`,
                    backgroundColor: tokens.gray300,
                }}
            >
                <Text
                    fontSize="fontSizeS"
                    color="colorBlack"
                    style={{
                        position: "absolute",
                        textAlign: "left",
                        left: 0,
                        minWidth: "200px",
                        padding: "4px 8px",
                    }}
                >{`${label} ${percentage.toFixed(0)}%`}</Text>
            </div>
        </Box>
    );
};

export default ProgressBar;
