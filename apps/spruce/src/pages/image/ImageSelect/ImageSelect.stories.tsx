import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import {
  ApolloMock,
  CustomMeta,
  CustomStoryObj,
} from "@evg-ui/lib/test_utils/types";
import { ImagesQuery, ImagesQueryVariables } from "gql/generated/types";
import { IMAGES } from "gql/queries";
import { ImageSelect } from ".";

const imagesMock: ApolloMock<ImagesQuery, ImagesQueryVariables> = {
  request: {
    query: IMAGES,
    variables: {},
  },
  result: {
    data: {
      images: ["ubuntu2204", "amazon2", "rhel90"],
    },
  },
};

export default {
  component: ImageSelect,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks: [imagesMock],
    },
  },
} satisfies CustomMeta<typeof ImageSelect>;

export const Default: CustomStoryObj<typeof ImageSelect> = {
  render: () => <ImageSelect selectedImage="ubuntu2204" />,
};

const loadingMocks = [{ request: { query: IMAGES }, delay: Infinity }];

export const Loading: CustomStoryObj<typeof ImageSelect> = {
  parameters: {
    apolloClient: {
      mocks: loadingMocks,
    },
  },
  render: () => <ImageSelect selectedImage="ubuntu2204" />,
};
