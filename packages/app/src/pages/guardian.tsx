/* eslint-disable camelcase */
import { Button, FormControl, FormHelperText, FormLabel, Input, Link, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";

import { DefaultLayout } from "@/components/layouts/Default";
import { useFluxWallet } from "@/hooks/useFluxWallet";

import { FluxWallet__factory } from "../../../contracts/typechain-types";

export interface PeerMeta {
  name: string;
  url: string;
}

const HomePage: NextPage = () => {
  const router = useRouter();
  const { fluxWalletAddress, contract } = useFluxWallet();
  const [guardian, setGuardians] = useState("");
  const [guardian2, setGuardians2] = useState("");
  const { data: signer } = useSigner();

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const txSetGuardians = async () => {
    if (!contract) {
      return;
    }
    await contract.setGuardians([guardian, guardian2], 2);
  };

  const onClickLink = () => {
    router.push(`${origin}/recovery?address=${fluxWalletAddress}`);
  };

  return (
    <DefaultLayout>
      {fluxWalletAddress && (
        <Stack spacing="8">
          <Stack spacing="4">
            <Stack spacing="2">
              <FormControl>
                <FormLabel fontSize="md" fontWeight="bold">
                  AcountAbstraction Address (ERC 4337)
                </FormLabel>
                <Text fontSize="xs">{fluxWalletAddress}</Text>
              </FormControl>
            </Stack>
            <Stack spacing="2">
              <FormControl>
                <FormLabel>Gardian 1</FormLabel>
                <Input type="text" fontSize="xs" value={guardian} onChange={(e) => setGuardians(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Gardian 2</FormLabel>
                <Input type="text" fontSize="xs" value={guardian2} onChange={(e) => setGuardians2(e.target.value)} />
                <FormHelperText fontSize="xs" color="blue.600">
                  * this is 2 of 2 social recovery for simple demo
                </FormHelperText>
              </FormControl>

              <Button w="full" colorScheme="brand" onClick={txSetGuardians} isDisabled={!guardian || !guardian2}>
                Set Gardian
              </Button>
            </Stack>
            <Text fontSize="md">Recovery URL to share</Text>
            <Text
              onClick={onClickLink}
              as={Link}
              fontSize="xs"
            >{`${origin}/recovery?address=${fluxWalletAddress}`}</Text>
          </Stack>
        </Stack>
      )}
    </DefaultLayout>
  );
};

export default HomePage;
