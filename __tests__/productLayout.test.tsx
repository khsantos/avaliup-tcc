import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProductLayout from "@/src/components/ProductLayout";
import ProductTabs from "@/src/components/ProductTabs";
import { RelatedProducts } from "@/src/components/RelatedProducts";
import { supabase } from "@/src/lib/supabase";

jest.mock("next/image", () => {
  const MockNextImage = (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt || ""} {...props} />;
  };
  MockNextImage.displayName = "MockNextImage";
  return MockNextImage;
});

jest.mock("@/src/contexts/supabase-provider", () => ({
  useSupabase: () => ({ session: { user: { id: "user-1" } } }),
}));

jest.mock("@/src/hooks/useFavorite", () => ({
  useFavorite: () => ({
    isWishlisted: false,
    loading: false,
    toggleFavorite: jest.fn(),
  }),
}));

// --- Mocks de componentes filhos ---------------------------------------------------
jest.mock("@/src/components/ProductGallery", () => ({
  __esModule: true,
  default: (props: { images?: string[]; productName?: string }) => (
    <div data-testid="mock-gallery">
      <img
        data-testid="product-image"
        src={props.images?.[0] ?? "/placeholder.jpg"}
        alt={props.productName ?? ""}
      />
    </div>
  ),
}));

jest.mock("@/src/components/ProductHeader", () => ({
  __esModule: true,
  default: (props: { name: string }) => (
    <div data-testid="product-name">{props.name}</div>
  ),
}));

jest.mock("@/src/components/ProductPrice", () => ({
  __esModule: true,
  default: (props: { lowestPrice?: number; lowestPlatform?: string }) => (
    <div data-testid="product-price-block">
      <span data-testid="product-price">
        {props.lowestPrice != null ? `R$${props.lowestPrice}` : "R$0,00"}
      </span>
      <a data-testid="buy-link" href={props.lowestPlatform ?? "#"}>
        Comprar
      </a>
    </div>
  ),
}));

jest.mock("@/src/components/ProductCriteriaRatings", () => ({
  __esModule: true,
  default: () => <div data-testid="product-criteria">criteria</div>,
}));

jest.mock("@/src/components/ProductActions", () => ({
  __esModule: true,
  default: () => <div data-testid="product-actions">actions</div>,
}));

jest.mock("@/src/components/PriceNotificationDialog", () => ({
  __esModule: true,
  default: () => <div data-testid="price-notif">price dialog</div>,
}));

jest.mock("@/src/components/ProductReview", () => ({
  __esModule: true,
  default: () => <div data-testid="product-review">review view</div>,
}));

jest.mock("@/src/components/PriceMarketplaceComparison", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="price-marketplace">
      <div data-testid="store-name">Loja Teste</div>
      <div data-testid="store-price">R$ 199,90</div>
      <a
        data-testid="store-link"
        href="https://loja-exemplo.com/produto/123"
        target="_blank"
        rel="noreferrer"
      >
        Acessar
      </a>
    </div>
  ),
}));

jest.mock("@/src/components/ProductSpecification", () => ({
  __esModule: true,
  default: () => <div data-testid="product-spec">spec</div>,
}));

jest.mock("@/src/components/UserReview", () => ({
  __esModule: true,
  default: () => <div data-testid="user-reviews">reviews</div>,
}));

jest.mock("@/src/components/FAQ", () => ({
  __esModule: true,
  default: () => <div data-testid="faq">faq</div>,
}));

jest.mock("@/src/components/ProductCard", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="related-product">
      <p>{props.name}</p>
      <button data-testid={`view-reviews-${props.id}`}>Ver avaliações</button>
    </div>
  ),
}));

// --- Testes ------------------------------------------------------------------------
describe("ProductLayout / ProductTabs - Tela de Detalhes do Produto", () => {
  const baseProduct = {
    id: 123,
    name: "Mouse Gamer Test",
    images: ["/mouse-test.jpg"],
    rating: 4.5,
    review_count: 10,
    rank: 1,
    category: "mouse",
    lowestPrice: 199.9,
    lowestPlatform: "https://loja-exemplo.com/produto/123",
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Caso 1: Visualizar informações do produto — mostra imagem, nome, preço e link de compra", async () => {
    render(<ProductLayout product={baseProduct as any} />);

    const img = await screen.findByTestId("product-image");
    expect(img).toBeInTheDocument();
    expect((img as HTMLImageElement).src).toContain("/mouse-test.jpg");

    const nameEls = screen.getAllByTestId("product-name");
    expect(nameEls[0]).toHaveTextContent("Mouse Gamer Test");

    const price = screen.getByTestId("product-price");
    expect(price).toHaveTextContent("R$199.9");

    const buyLink = screen.getByTestId("buy-link");
    expect((buyLink as HTMLAnchorElement).href).toBe(
      "https://loja-exemplo.com/produto/123"
    );
  });

  test("Caso 2: Visualizar preços em lojas disponíveis (aba Preços)", () => {
    render(<ProductTabs productId={123} />);

    expect(screen.getByTestId("user-reviews")).toBeInTheDocument();

    const precosTab = screen.getByRole("button", { name: /preços/i });
    fireEvent.click(precosTab);

    const priceSection = screen.getByTestId("price-marketplace");
    expect(priceSection).toBeInTheDocument();

    expect(screen.getByTestId("store-name")).toHaveTextContent("Loja Teste");
    expect(screen.getByTestId("store-price")).toHaveTextContent("R$ 199,90");
  });

  test("Caso 3: Visualizar produtos semelhantes", async () => {
    const mockSelect = jest.fn();

    mockSelect
      .mockReturnValueOnce({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { category: "mouse" },
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({
        eq: jest.fn().mockReturnValue({
          neq: jest.fn().mockResolvedValue({
            data: [
              {
                id: 2,
                name: "Mouse Gamer X",
                image: "/mouse-x.jpg",
                rating: 4.7,
              },
              {
                id: 3,
                name: "Mouse Pro Z",
                image: "/mouse-z.jpg",
                rating: 4.3,
              },
            ],
            error: null,
          }),
        }),
      });

    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

    render(<RelatedProducts productId={1} />);

    await waitFor(() =>
      expect(screen.getByText(/produtos relacionados/i)).toBeInTheDocument()
    );

    const relatedProducts = screen.getAllByTestId("related-product");
    expect(relatedProducts).toHaveLength(2);
    expect(screen.getByText("Mouse Gamer X")).toBeInTheDocument();
    expect(screen.getByText("Mouse Pro Z")).toBeInTheDocument();

    const viewButton = screen.getByTestId("view-reviews-2");
    fireEvent.click(viewButton);
  });

  test("Caso 4: Conferir ficha técnica", async () => {
    render(<ProductTabs productId={123} />);

    expect(screen.getByTestId("user-reviews")).toBeInTheDocument();

    const especificacoesTab = screen.getByRole("button", {
      name: /especificações/i,
    });
    fireEvent.click(especificacoesTab);

    expect(await screen.findByText(/ficha técnica/i)).toBeInTheDocument();

    expect(
      screen.getByText(/consulte as especificações técnicas/i)
    ).toBeInTheDocument();

    const specSection = screen.getByTestId("product-spec");
    expect(specSection).toBeInTheDocument();
    expect(specSection).toHaveTextContent("spec");
  });

  test("Caso 5: Conferir dúvidas", async () => {
    render(<ProductTabs productId={123} />);

    expect(screen.getByTestId("user-reviews")).toBeInTheDocument();

    const duvidasTab = screen.getByRole("button", { name: /dúvidas/i });
    fireEvent.click(duvidasTab);

    const faqSection = await screen.findByTestId("faq");
    expect(faqSection).toBeInTheDocument();
    expect(faqSection).toHaveTextContent("faq");
  });
});
