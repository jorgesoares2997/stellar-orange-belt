import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";

vi.mock("@/lib/stellar", () => ({
  ensureWalletConnection: vi.fn(),
  donate: vi.fn(),
  getCampaignState: vi.fn().mockResolvedValue({ goal: 1000, totalRaised: 100, recentDonations: [] }),
}));

function renderWithProviders() {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <AppShell />
    </QueryClientProvider>
  );
}

afterEach(() => {
  cleanup();
});

describe("AppShell", () => {
  it("renders campaign title", async () => {
    renderWithProviders();
    expect(await screen.findByText("Stellar Micro Crowdfunding")).toBeInTheDocument();
  });

  it("shows donate button", async () => {
    renderWithProviders();
    expect(await screen.findByRole("button", { name: "Donate" })).toBeInTheDocument();
  });

  it("renders connect wallet button", async () => {
    renderWithProviders();
    expect(await screen.findByRole("button", { name: "Connect Freighter" })).toBeInTheDocument();
  });
});
