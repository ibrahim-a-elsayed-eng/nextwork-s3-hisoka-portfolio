
## What I Built

I hosted a static website on Amazon S3 during 39 minutes of hands-on work recorded by creating a bucket named nextwork-website-hisoka-portfolio in the eu-north-1 region, filling in 4 settings across 2 minutes in creation forms. I configured public access settings and bucket options, uploaded 3 website files totaling 211.3 KB including hisoka-banner.jpg, error.html, and index.html, and enabled static website hosting by setting the index document to index.html.

## Tech Stack

- Amazon S3, with 9 pages opened, used as a cloud object storage service to store and host the website files
- eu-north-1, used as the region for hosting resources
- AWS console, used as a web-based interface to manage cloud resources

## Highlights

- Uploaded 3 website files totaling 211.3 KB, including hisoka-banner.jpg, error.html, and index.html to the S3 bucket.
- Configured static website hosting on the S3 bucket using the index document setting of index.html.
- Edited bucket policy by typing confirm to delete it successfully from the bucket.
- Achieved a perfect score of 5 out of 5 on the quiz covering static website hosting on Amazon S3.

## Steps I took

- Step 1: Opened the AWS console and searched for S3.
- Step 2: Navigated to the S3 buckets homepage and checked the region.
- Step 3: Filled in the Create S3 bucket form, typed in the bucket name nextwork-website-hisoka-portfolio, and configured public access settings and bucket options.
- Step 4: Opened the created S3 bucket page and clicked upload to add website files.
- Step 5: Uploaded website files including hisoka-banner.jpg, error.html, and index.html to the S3 bucket.
- Step 6: Opened edit static website hosting, typed in the index document setting of index.html, and clicked save changes.
- Step 7: Clicked the website endpoint link and encountered a 403 Forbidden error.
- Step 8: Selected objects in the S3 bucket, opened the actions menu, and clicked make public using ACL to resolve the error.
- Step 9: Opened bucket properties and permissions, and opened edit bucket policy.
- Step 10: Attempted to delete objects including index.html and encountered an access denied error.
- Step 11: Typed confirm to delete the bucket policy and successfully deleted it.
- Step 12: Completed the quiz on hosting a static website on Amazon S3 and achieved a perfect score.

## Hardest Problem Solved

When I clicked the website endpoint link, I encountered a 403 Forbidden error because the uploaded objects were private by default. I found the issue by testing the endpoint in my browser, and I fixed it by selecting the index.html object in the S3 bucket, opening the actions menu, and clicking make public using ACL to grant public access. Later, when attempting to delete objects, I encountered an access denied error on index.html, which I resolved by deleting the restrictive bucket policy after typing confirm to confirm the action.
