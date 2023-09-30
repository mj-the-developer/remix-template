import { useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";

import { Form, useActionData, useLoaderData } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";

import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export async function loader({ request }: LoaderArgs) {
  const errors = loginErrorMessage(await login(request));

  return json({
    errors,
    polarisTranslations: require(`@shopify/polaris/locales/en.json`),
  });
}

export async function action({ request }: LoaderArgs) {
  const errors = loginErrorMessage(await login(request));

  return json({
    errors,
  });
}

export default function Auth() {
  const { polarisTranslations } = useLoaderData<typeof loader>();
  const loaderData = useLoaderData();
  const actionData = useActionData<typeof action>();

  const [shop, setShop] = useState("");

  const { errors } = actionData || loaderData;

  return (
    <PolarisAppProvider i18n={polarisTranslations}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Log in
              </Text>
              <TextField
                type="text"
                name="shop"
                label="Shop domain"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                // @ts-ignore
                error={errors.shop}
              />
              <Button submit>Log in</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}
