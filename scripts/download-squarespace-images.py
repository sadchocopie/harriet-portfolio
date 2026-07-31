#!/usr/bin/env python3
"""
download-squarespace-images.py

Downloads every image that's still hosted on Squarespace's CDN and saves it
into the organized local folders under img/projects/, using the same
filenames the HTML/data files already expect. Run this once from the repo
root:

    python3 scripts/download-squarespace-images.py

No dependencies beyond Python's standard library — nothing to pip install.
Safe to re-run: it skips any file that's already been downloaded.

After running this, every page/data file already points at these local
paths (see MANIFEST below for the full old-URL -> new-path mapping), so
there's nothing else to wire up — the site simply stops depending on
Squarespace once these files exist locally.
"""

import os
import ssl
import urllib.request

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Some corporate networks (Zscaler and similar SSL-inspection proxies are the
# most common cause) intercept HTTPS traffic with a root certificate that
# newer/stricter OpenSSL versions reject — you'll see an error like
# "Basic Constraints of CA cert not marked critical". That's a network-level
# quirk, not a real security problem for downloading public portfolio images,
# so if the normal (verified) request fails for that reason, we retry once
# with certificate verification turned off JUST for this script's own
# requests. This does not change anything else on your machine.
_UNVERIFIED_CONTEXT = ssl.create_default_context()
_UNVERIFIED_CONTEXT.check_hostname = False
_UNVERIFIED_CONTEXT.verify_mode = ssl.CERT_NONE

# (Squarespace URL, local path relative to repo root)
MANIFEST = [
    # --- App Marketplace Integration ---
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/2e7a61d5-c3bb-4d03-99c1-ce402bf9ebe7/MC+showcase.png",
     "img/projects/app-integration/hero-mc-showcase.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/174e3f68-d724-42f7-84b2-ee4bb52b490c/QB+Showcase.png",
     "img/projects/app-integration/qb-showcase.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/385b6e9e-fb2f-4bef-90b4-e19d2434c9e1/IntuitAppIntegration.png",
     "img/projects/app-integration/intuit-app-integration.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/6c41f7e8-5dc7-4783-80c2-06e9701b4585/Pattern+Sense.png",
     "img/projects/app-integration/pattern-sense.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/bb1d5c52-4d15-4e97-8215-66203feb77f9/QB.png",
     "img/projects/app-integration/qb.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/0830e548-540a-47fc-b8df-9f1e2a47d94b/MC.png",
     "img/projects/app-integration/mc.png"),

    # --- Document Auto Import ---
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/ffe6f1e8-4d5b-403e-b975-5ce2c3a64741/Multi+Channel.png",
     "img/projects/doc-auto-import/hero-multi-channel.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/eac697f3-35a9-4e0a-bce1-e25054f295c9/QB+Problem.png",
     "img/projects/doc-auto-import/qb-problem.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/2392eef7-b527-4c49-9f7f-75abc16bf83a/TT+Problem.png",
     "img/projects/doc-auto-import/tt-problem.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/82f7b965-bcae-447c-82c9-11c4a4a8ad4d/Education+A.png",
     "img/projects/doc-auto-import/education-a.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/44746bcf-1793-46fa-959d-8fff1a3a30bc/Education+B.png",
     "img/projects/doc-auto-import/education-b.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/5cf149cf-df83-472f-808f-1d77e3fcff58/Education+C.png",
     "img/projects/doc-auto-import/education-c.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/980eabd1-6f95-4e84-b113-e4b67d62e2e6/Multi+Channel+-+alt.png",
     "img/projects/doc-auto-import/multi-channel-alt.png"),

    # --- Route: Year in Review ---
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/569e2eec-e40a-4276-bd60-35cd34a49458/RouteAppSummary.png",
     "img/projects/route-year-in-review/hero-route-summary.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/6b1dccba-b1cd-4d7b-bba1-b5eb2ee9c5d3/2021+Exploration.png",
     "img/projects/route-year-in-review/exploration-2021.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/1a8143c0-394c-463f-87e0-5cff96e3eecf/2022+Exploration.png",
     "img/projects/route-year-in-review/exploration-2022.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/007348b0-c0ff-426d-8177-95dfe9dea78f/Prototyping.png",
     "img/projects/route-year-in-review/prototyping.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/5504acd8-b00b-4590-b15a-12c9512f3db3/2021-AB+Test+Improvement.png",
     "img/projects/route-year-in-review/ab-test-2021.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/24514d06-efcd-4ce1-8325-aa482da6e57b/AB+Test+Improvement.png",
     "img/projects/route-year-in-review/ab-test-improvement.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/a17a13ca-b58c-4f9c-9973-167947fa96b0/RouteApp.png",
     "img/projects/route-year-in-review/route-app.png"),
    ("https://images.squarespace-cdn.com/content/v1/5baa9aa9f8135a6e5700633c/4a553626-12aa-4ed3-a2b4-4007d3e2ed5c/MostLikedSummaryScreen.png",
     "img/projects/route-year-in-review/most-liked-summary-screen.png"),

    # --- Product Design at Route (harrietwang.com/designatroute) ---
    # NOTE: the original hero cover image was replaced with Harriet's own
    # uploaded cover.jpg (see img/projects/design-at-route/cover.jpg) —
    # no longer fetched from Squarespace.
    # NOTE: onboarding.png, checkout.png, add-card.png, and year-in-review.png
    # were replaced with Harriet's own uploaded feature screenshots — no
    # longer fetched from Squarespace. Design at Route no longer depends on
    # this script for ANY of its images (cover, package-protection, and
    # boxes-tracking were also direct uploads — see earlier in this file's
    # history / HANDOFF.md).
]


def main():
    ok, skipped, failed, ok_unverified = 0, 0, 0, 0
    for url, rel_path in MANIFEST:
        dest = os.path.join(REPO_ROOT, rel_path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)

        if os.path.exists(dest):
            print(f"  skip (already exists): {rel_path}")
            skipped += 1
            continue

        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        try:
            with urllib.request.urlopen(req, timeout=20) as resp, open(dest, "wb") as f:
                f.write(resp.read())
            print(f"  saved: {rel_path}")
            ok += 1
            continue
        except Exception as e:
            is_cert_issue = "CERTIFICATE_VERIFY_FAILED" in str(e) or "SSL" in str(e)
            if not is_cert_issue:
                print(f"  FAILED: {rel_path}  ({e})")
                failed += 1
                continue
            # Likely a corporate SSL-inspection proxy (Zscaler etc.) — retry
            # once without certificate verification, see comment up top.
            try:
                with urllib.request.urlopen(req, timeout=20, context=_UNVERIFIED_CONTEXT) as resp, open(dest, "wb") as f:
                    f.write(resp.read())
                print(f"  saved (unverified TLS, corporate proxy workaround): {rel_path}")
                ok += 1
                ok_unverified += 1
            except Exception as e2:
                print(f"  FAILED: {rel_path}  ({e2})")
                failed += 1

    print(f"\nDone — {ok} downloaded, {skipped} already present, {failed} failed.")
    if ok_unverified:
        print(f"({ok_unverified} of those needed the corporate-proxy TLS workaround — that's expected/fine, not a problem with the files themselves.)")
    if failed:
        print("Any failures above: check your internet connection and re-run — it's safe, already-downloaded files are skipped.")


if __name__ == "__main__":
    main()
