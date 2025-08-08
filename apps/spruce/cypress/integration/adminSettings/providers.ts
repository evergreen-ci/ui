import { EcsOperatingSystem } from "gql/generated/types";
import { clickSave } from "../../utils";

describe("providers", () => {
  beforeEach(() => {
    cy.visit("/admin-settings");
  });

  it("can configure and save Container Pools", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Container Pools section
    cy.dataCy("container-pools").within(() => {
      cy.dataCy("add-button").click();

      cy.dataCy("container-pools-list")
        .children()
        .first()
        .within(() => {
          cy.getInputByLabel("ID").as("poolIdInput");
          cy.get("@poolIdInput").clear();
          cy.get("@poolIdInput").type("test-pool-id");

          cy.getInputByLabel("Distro").as("poolDistroInput");
          cy.get("@poolDistroInput").clear();
          cy.get("@poolDistroInput").type("ubuntu2004");

          cy.getInputByLabel("Max Containers").as("poolMaxContainersInput");
          cy.get("@poolMaxContainersInput").clear();
          cy.get("@poolMaxContainersInput").type("10");

          cy.getInputByLabel("Port").as("poolPortInput");
          cy.get("@poolPortInput").clear();
          cy.get("@poolPortInput").type("8080");
        });
    });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("container-pools").within(() => {
      cy.dataCy("container-pools-list")
        .children()
        .first()
        .within(() => {
          cy.getInputByLabel("ID").should("have.value", "test-pool-id");
          cy.getInputByLabel("Distro").should("have.value", "ubuntu2004");
          cy.getInputByLabel("Max Containers").should("have.value", "10");
          cy.getInputByLabel("Port").should("have.value", "8080");
        });
    });
  });

  it.only("can configure and save AWS Configuration", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // AWS Configuration section
    cy.dataCy("aws-configuration").within(() => {
      cy.getInputByLabel("EC2 Key").as("ec2KeyInput");
      cy.get("@ec2KeyInput").clear();
      cy.get("@ec2KeyInput").type("test-ec2-key");

      cy.getInputByLabel("EC2 Secret").as("ec2SecretInput");
      cy.get("@ec2SecretInput").clear();
      cy.get("@ec2SecretInput").type("test-ec2-secret");

      cy.getInputByLabel("Parameter Store Prefix").as("paramStoreInput");
      cy.get("@paramStoreInput").clear();
      cy.get("@paramStoreInput").type("/test/prefix");

      cy.getInputByLabel("Default Security Group").as("securityGroupInput");
      cy.get("@securityGroupInput").clear();
      cy.get("@securityGroupInput").type("sg-123456789");

      cy.getInputByLabel("Total EBS Volume Size Per User").as(
        "volumeSizeInput",
      );
      cy.get("@volumeSizeInput").clear();
      cy.get("@volumeSizeInput").type("500");

      cy.getInputByLabel("Pod ECS Max CPU Units Per Pod").as("maxCpuInput");
      cy.get("@maxCpuInput").clear();
      cy.get("@maxCpuInput").type("2048");

      cy.getInputByLabel("Pod ECS Max Memory (MB) Per Pod").as(
        "maxMemoryInput",
      );
      cy.get("@maxMemoryInput").clear();
      cy.get("@maxMemoryInput").type("4096");

      cy.getInputByLabel("Allowed Instance Types").as("instanceTypesInput");
      cy.get("@instanceTypesInput").type("m5.large{enter}");
      cy.get("@instanceTypesInput").type("m5.xlarge{enter}");

      cy.getInputByLabel("Allowed Regions").as("regionsInput");
      cy.get("@regionsInput").type("us-east-1{enter}");
      cy.get("@regionsInput").type("us-west-2{enter}");

      cy.getInputByLabel("Allowed Container Images").as("imagesInput");
      cy.get("@imagesInput").type("ubuntu:20.04{enter}");
      cy.get("@imagesInput").type("alpine:latest{enter}");

      // Add subnet
      cy.contains("button", "Add subnet").click();
      cy.dataCy("subnets-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Availability Zone").as("subnetAzInput");
          cy.get("@subnetAzInput").clear();
          cy.get("@subnetAzInput").type("us-east-1a");

          cy.getInputByLabel("Subnet ID").as("subnetIdInput");
          cy.get("@subnetIdInput").clear();
          cy.get("@subnetIdInput").type("subnet-123456789");
        });

      // Add account role
      cy.contains("button", "Add account role").click();
      cy.dataCy("account-roles-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Account").as("accountInput");
          cy.get("@accountInput").clear();
          cy.get("@accountInput").type("123456789012");

          cy.getInputByLabel("Role").as("roleInput");
          cy.get("@roleInput").clear();
          cy.get("@roleInput").type("EvergreenRole");
        });

      // Add cluster
      cy.contains("button", "Add cluster").click();
      cy.dataCy("clusters-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Name").as("clusterNameInput");
          cy.get("@clusterNameInput").clear();
          cy.get("@clusterNameInput").type("test-cluster");
        });
    });

    cy.selectLGOption("OS", EcsOperatingSystem.EcsosLinux);

    cy.dataCy("aws-configuration").within(() => {
      // Add capacity provider
      cy.contains("button", "Add capacity provider").click();
      cy.dataCy("capacity-providers-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Name").as("capacityProviderNameInput");
          cy.get("@capacityProviderNameInput").clear();
          cy.get("@capacityProviderNameInput").type("test-capacity-provider");
        });
    });

    cy.dataCy("capacity-providers-list").scrollIntoView();
    cy.selectLGOption("OS", EcsOperatingSystem.EcsosLinux);
    cy.selectLGOption("Architecture", `ECS_ARCH_AMD64`);

    cy.dataCy("aws-configuration").within(() => {
      // Test POD ECS AWSVPC fields
      cy.getInputByLabel("Subnet IDs").as("awsVpcSubnetsInput");
      cy.get("@awsVpcSubnetsInput").type("subnet-vpc-123{enter}");
      cy.get("@awsVpcSubnetsInput").type("subnet-vpc-456{enter}");

      cy.getInputByLabel("Security Group IDs").as("awsVpcSecurityGroupsInput");
      cy.get("@awsVpcSecurityGroupsInput").type("sg-vpc-123{enter}");
      cy.get("@awsVpcSecurityGroupsInput").type("sg-vpc-456{enter}");

      // Test Pod-related fields
      cy.getInputByLabel("Pod Role").as("podRoleInput");
      cy.get("@podRoleInput").clear();
      cy.get("@podRoleInput").type("arn:aws:iam::123456789012:role/PodRole");

      cy.getInputByLabel("Pod Region").as("podRegionInput");
      cy.get("@podRegionInput").clear();
      cy.get("@podRegionInput").type("us-east-1");

      cy.getInputByLabel("Pod ECS Task Role").as("taskRoleInput");
      cy.get("@taskRoleInput").clear();
      cy.get("@taskRoleInput").type("arn:aws:iam::123456789012:role/TaskRole");

      cy.getInputByLabel("Pod ECS Execution Role").as("executionRoleInput");
      cy.get("@executionRoleInput").clear();
      cy.get("@executionRoleInput").type(
        "arn:aws:iam::123456789012:role/ExecutionRole",
      );

      // Test Docker API Version
      cy.getInputByLabel("API Version").as("dockerApiVersionInput");
      cy.get("@dockerApiVersionInput").clear();
      cy.get("@dockerApiVersionInput").type("1.41");
    });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    // Verify AWS Configuration data persisted
    cy.dataCy("aws-configuration").within(() => {
      cy.getInputByLabel("EC2 Key").should("have.value", "test-ec2-key");
      cy.getInputByLabel("EC2 Secret").should("have.value", "test-ec2-secret");
      cy.getInputByLabel("Parameter Store Prefix").should(
        "have.value",
        "/test/prefix",
      );
      cy.getInputByLabel("Default Security Group").should(
        "have.value",
        "sg-123456789",
      );
      cy.getInputByLabel("Total EBS Volume Size Per User").should(
        "have.value",
        "500",
      );
      cy.getInputByLabel("Pod ECS Max CPU Units Per Pod").should(
        "have.value",
        "2048",
      );
      cy.getInputByLabel("Pod ECS Max Memory (MB) Per Pod").should(
        "have.value",
        "4096",
      );

      // Verify ChipInput values
      cy.dataCy("filter-chip").should("contain", "m5.large");
      cy.dataCy("filter-chip").should("contain", "us-east-1");
      cy.dataCy("filter-chip").should("contain", "ubuntu:20.04");

      // Verify subnet data
      cy.dataCy("subnets-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Availability Zone").should(
            "have.value",
            "us-east-1a",
          );
          cy.getInputByLabel("Subnet ID").should(
            "have.value",
            "subnet-123456789",
          );
        });

      // Verify account roles
      cy.dataCy("account-roles-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Account").should("have.value", "123456789012");
          cy.getInputByLabel("Role").should("have.value", "EvergreenRole");
        });

      // Verify clusters
      cy.dataCy("clusters-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Name").should("have.value", "test-cluster");
        });

      // Verify capacity providers
      cy.dataCy("capacity-providers-list")
        .children()
        .last()
        .within(() => {
          cy.getInputByLabel("Name").should(
            "have.value",
            "test-capacity-provider",
          );
        });

      // Verify POD roles and regions
      cy.getInputByLabel("Pod Role").should("contain.value", "PodRole");
      cy.getInputByLabel("Pod Region").should("have.value", "us-east-1");
      cy.getInputByLabel("Pod ECS Task Role").should(
        "contain.value",
        "TaskRole",
      );
      cy.getInputByLabel("Pod ECS Execution Role").should(
        "contain.value",
        "ExecutionRole",
      );

      // Verify Docker API Version
      cy.getInputByLabel("API Version").should("have.value", "1.41");
    });
  });

  it("can configure and save Repo Exceptions", () => {
    cy.dataCy("save-settings-button").should(
      "have.attr",
      "aria-disabled",
      "true",
    );

    // Repo Exceptions section
    cy.dataCy("repo-exceptions")
      .first()
      .within(() => {
        cy.dataCy("add-button").click();

        cy.getInputByLabel("Owner").as("repoOwnerInput");
        cy.get("@repoOwnerInput").clear();
        cy.get("@repoOwnerInput").type("evergreen-ci");

        cy.getInputByLabel("Repository").as("repoNameInput");
        cy.get("@repoNameInput").clear();
        cy.get("@repoNameInput").type("evergreen");
      });

    clickSave();
    cy.validateToast("success", "Settings saved successfully");
    cy.reload();

    cy.dataCy("repo-exceptions")
      .first()
      .within(() => {
        cy.getInputByLabel("Owner").should("have.value", "evergreen-ci");
        cy.getInputByLabel("Repository").should("have.value", "evergreen");
      });
  });
});
