<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="id">
      <head>
        <meta charset="utf-8"/>
        <title>Peta Situs – Roda Emas Indonesia</title>
        <style>
          body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f7f9fa;color:#1a2833;margin:0;padding:40px}
          h1{font-size:28px;margin-bottom:8px}
          p{margin-top:0;margin-bottom:24px;color:#4a5863}
          table{border-collapse:collapse;width:100%;background:#fff;box-shadow:0 2px 12px rgba(17,39,56,0.08);border-radius:12px;overflow:hidden}
          thead{background:#013d39;color:#fff}
          th,td{padding:16px;text-align:left;font-size:15px}
          tbody tr:nth-child(even){background:#f0f4f5}
          a{color:#0a6c60;text-decoration:none}
          a:hover{text-decoration:underline}
          .badge{display:inline-block;padding:4px 10px;border-radius:999px;background:#d6f5ef;color:#0a6c60;font-size:12px;margin-top:12px}
        </style>
      </head>
      <body>
        <h1>Peta Situs Roda Emas Indonesia</h1>
        <p>Daftar URL yang disediakan untuk mesin pencari. Total <strong><xsl:value-of select="count(//sitemap:url)"/></strong> halaman.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Prioritas</th>
              <th>Frekuensi Perubahan</th>
              <th>Terakhir Diubah</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="//sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:value-of select="sitemap:priority"/>
                </td>
                <td>
                  <xsl:value-of select="sitemap:changefreq"/>
                </td>
                <td>
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
        <div class="badge">Generated for crawlers, styled for humans</div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
