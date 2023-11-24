module.exports = ({ title, description, buttonText, name, url }) => {
  return `
    <html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
            @media screen {
                @font-face {
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'),
                        url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                }

                @font-face {
                    font-family: 'Source Sans Pro';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'),
                        url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                }
            }

            body,
            table,
            td,
            a {
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }

            table,
            td {
                mso-table-rspace: 0pt;
                mso-table-lspace: 0pt;
            }

            img {
                -ms-interpolation-mode: bicubic;
            }

            a[x-apple-data-detectors] {
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                color: inherit !important;
                text-decoration: none !important;
            }

            div[style*='margin: 16px 0;'] {
                margin: 0 !important;
            }

            body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            table {
                border-collapse: collapse !important;
            }

            a {
                color: #3869d4;
            }

            img {
                height: auto;
                line-height: 100%;
                text-decoration: none;
                border: 0;
                outline: none;
            }
        </style>
    </head>

    <body style="background-color: #edf2f7">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                        <tr>
                            <td align="center" valign="top" style="padding: 36px 24px">
                                <a href="#" target="_blank" style="display: inline-block">
                                    <img src="https://res.cloudinary.com/harun-rucse/image/upload/v1659431221/images/email_logo_c45r2b.png" alt="Logo" border="0" width="48" style="
                                                display: block;
                                                width: 48px;
                                                max-width: 48px;
                                                min-width: 48px;
                                            " />
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="
                                        padding: 36px 24px 0;
                                        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                        border-top: 3px solid #d4dadf;
                                    ">
                                <h1 style="
                                            margin: 0;
                                            text-align: center;
                                            font-size: 32px;
                                            font-weight: 500;
                                            letter-spacing: -1px;
                                            line-height: 48px;
                                            color: #3d4852;
                                        ">
                                    ${title}
                                </h1>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="
                                        padding: 24px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        font-weight: 500;
                                        line-height: 24px;
                                    ">
                                <p style="margin: 0">
                                    Hello, ${name}
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="left" bgcolor="#ffffff" style="
                                        padding: 0px 24px 24px 24px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 24px;
                                    ">
                                <p style="margin: 0">
                                    ${description}
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" bgcolor="#ffffff" style="padding: 12px">
                                            <table border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center" bgcolor="#2d3748" style="border-radius: 6px">
                                                        <a href="${url}" target="_blank" style="
                                                                    display: inline-block;
                                                                    padding: 12px 36px;
                                                                    font-family: 'Source Sans Pro', Helvetica, Arial,
                                                                        sans-serif;
                                                                    font-size: 16px;
                                                                    color: #ffffff;
                                                                    text-decoration: none;
                                                                    border-radius: 6px;
                                                                ">${buttonText}</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="
                                        padding: 24px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 24px;
                                    ">
                                <p style="margin: 0">
                                    If that doesn't work, copy and paste the following link in
                                    your browser:
                                </p>
                                <p style="margin: 0"><a href="${url}" target="_blank">${url}</a></p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" bgcolor="#ffffff" style="
                                        padding: 24px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 24px;
                                        border-bottom: 3px solid #d4dadf;
                                    ">
                                <p style="margin: 0">
                                    Regards,<br />
                                    ${process.env.APP_NAME}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 24px">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                        <tr>
                            <td align="center" bgcolor="#e9ecef" style="
                                        padding: 12px 24px;
                                        font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                        font-size: 14px;
                                        line-height: 20px;
                                        color: #666;
                                    ">
                                <p style="margin: 0">
                                    &copy; ${process.env.APP_NAME}. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};
