module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  const defaultLang = "fr";
  const supportedLanguages = ["fr", "en"];

  function fallbackLanguageUrl(lang) {
    return `/${supportedLanguages.includes(lang) ? lang : defaultLang}/`;
  }

  eleventyConfig.addFilter("translationUrl", function (items, translationKey, targetLang) {
    if (!translationKey || !Array.isArray(items)) {
      return fallbackLanguageUrl(targetLang);
    }

    const translation = items.find((item) => {
      return item.data
        && item.data.translationKey === translationKey
        && item.data.lang === targetLang
        && item.url;
    });

    return translation ? translation.url : fallbackLanguageUrl(targetLang);
  });

  eleventyConfig.addCollection("projects", function (collectionApi) {
    return collectionApi.getAll().filter((item) => {
      return /[\\/]src[\\/](fr|en)[\\/]projects[\\/][^\\/]+\.md$/.test(item.inputPath);
    }).sort((a, b) => {
      const orderA = Number(a.data.order);
      const orderB = Number(b.data.order);
      const safeOrderA = Number.isFinite(orderA) ? orderA : Number.MAX_SAFE_INTEGER;
      const safeOrderB = Number.isFinite(orderB) ? orderB : Number.MAX_SAFE_INTEGER;

      if (safeOrderA !== safeOrderB) {
        return safeOrderA - safeOrderB;
      }

      const yearA = Number(a.data.year) || 0;
      const yearB = Number(b.data.year) || 0;

      if (yearA !== yearB) {
        return yearB - yearA;
      }

      return String(a.data.title || "").localeCompare(String(b.data.title || ""));
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"]
  };
};
