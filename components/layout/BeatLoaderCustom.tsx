import { Flex } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

const BeatLoaderCustom = () => {
    return (
        <Flex justifyContent="center" alignItems="center" minHeight="100vh">
            <BeatLoader color="cyan" />
        </Flex>
    );
};

export default BeatLoaderCustom;
