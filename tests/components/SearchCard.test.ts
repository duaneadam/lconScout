import { describe, it, expect, beforeEach, vi } from "vitest";
import { shallowMount, VueWrapper, config } from "@vue/test-utils";
import SearchCard from "@/components/SearchCard.vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

vi.mock("@lottiefiles/lottie-player", () => ({}));

const lottieAsset = {
  id: 3,
  uuid: "lottie-uuid",
  asset: "lottie",
  name: "Test Lottie",
  slug: "test-lottie",
  identifier: "lottie-id",
  price: 5,
  urls: {
    lottie: "animation.lottie",
    original: "animation.json",
    preview_image: "lottie_preview.png",
  },
  color_codes: [],
  is_premium: false,
  payable_price: 5,
  formats: [{ id: 3, name: "lottie", mime_type: "application/json" }],
};

const DotLottieVueStub = {
  name: "DotLottieVue",
  template: "<div></div>",
};
const LottiePlayerStub = {
  name: "LottiePlayer",
  template: "<div></div>",
};

const dummyAsset = {
  id: 1,
  uuid: "dummy-uuid",
  asset: "icon",
  name: "Dummy Asset",
  slug: "dummy-asset",
  identifier: "dummy-id",
  price: 0,
  urls: {},
  color_codes: [],
  is_premium: false,
  payable_price: 0,
  formats: [],
};

describe("SearchCard.vue", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    config.global.stubs = {
      DotLottieVue: DotLottieVueStub,
      "lottie-player": LottiePlayerStub,
    };
  });

  it("renders skeleton state correctly", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        skeleton: true,
        lottiePlayerType: "dotlottie",
      },
    });
    const article = wrapper.find("article.search-card");
    expect(article.classes()).toContain("search-card--skeleton");
    expect(wrapper.find(".search-card__thumbnail--skeleton").exists()).toBe(
      true
    );
    expect(wrapper.find(".search-card__image-wrapper").exists()).toBe(false);
    expect(article.classes()).not.toContain("search-card--withOverlay");
  });

  it("renders overlay state correctly", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        isLastInSection: true,
        asset: dummyAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    const article = wrapper.find("article.search-card");
    expect(article.classes()).toContain("search-card--withOverlay");
    expect(wrapper.find(".search-card__overlay").exists()).toBe(true);
    expect(wrapper.find(".search-card__overlay-text").text()).toBe("View more");
    expect(article.classes()).not.toContain("search-card--skeleton");
    expect(wrapper.find(".search-card__thumbnail--skeleton").exists()).toBe(
      false
    );
  });

  it("renders default card state correctly", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        asset: dummyAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    const article = wrapper.find("article.search-card");
    expect(wrapper.find(".search-card__thumbnail").exists()).toBe(true);
    expect(wrapper.find(".search-card__image-wrapper").exists()).toBe(true);
    expect(article.classes()).not.toContain("search-card--skeleton");
    expect(article.classes()).not.toContain("search-card--withOverlay");
    expect(wrapper.find(".search-card__thumbnail--skeleton").exists()).toBe(
      false
    );
    expect(wrapper.find(".search-card__overlay").exists()).toBe(true);
  });

  it("applies square variant class correctly", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        variant: "square",
        asset: dummyAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    expect(wrapper.find("article.search-card").classes()).toContain(
      "search-card--square"
    );
  });

  it("applies default variant class correctly (no variant prop)", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        asset: dummyAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    expect(wrapper.find("article.search-card").classes()).not.toContain(
      "search-card--square"
    );
  });

  it("applies default variant class correctly (variant='default')", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        variant: "default",
        asset: dummyAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    expect(wrapper.find("article.search-card").classes()).not.toContain(
      "search-card--square"
    );
  });

  it("renders default card state correctly (non-lottie asset)", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        asset: dummyAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    const article = wrapper.find("article.search-card");
    expect(wrapper.find(".search-card__thumbnail").exists()).toBe(true);
    expect(wrapper.find(".search-card__image-wrapper").exists()).toBe(true);
    expect(article.classes()).not.toContain("search-card--skeleton");
    expect(article.classes()).not.toContain("search-card--withOverlay");
    expect(wrapper.find(".search-card__thumbnail--skeleton").exists()).toBe(
      false
    );
    expect(wrapper.find(".search-card__overlay").exists()).toBe(true);
    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.findComponent(DotLottieVue).exists()).toBe(false);
    expect(wrapper.findComponent(LottiePlayerStub).exists()).toBe(false);
  });

  it("renders DotLottieVue player when asset is lottie and type is dotlottie", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        asset: lottieAsset,
        lottiePlayerType: "dotlottie",
      },
    });
    expect(wrapper.findComponent(DotLottieVue).exists()).toBe(true);
    expect(wrapper.findComponent(LottiePlayerStub).exists()).toBe(false);
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("renders lottie-player when asset is lottie and type is lottiejson", () => {
    wrapper = shallowMount(SearchCard, {
      props: {
        asset: lottieAsset,
        lottiePlayerType: "lottiejson",
      },
    });
    expect(wrapper.findComponent(LottiePlayerStub).exists()).toBe(true);
    expect(wrapper.findComponent(DotLottieVue).exists()).toBe(false);
    expect(wrapper.find("img").exists()).toBe(false);
  });
});
