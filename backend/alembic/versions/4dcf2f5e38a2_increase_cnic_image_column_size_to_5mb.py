"""increase_cnic_image_column_size_to_5mb

Revision ID: 4dcf2f5e38a2
Revises: 5ea5a3ca8be7
Create Date: 2025-10-19 15:47:11.273385

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4dcf2f5e38a2'
down_revision = '5ea5a3ca8be7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Increase CNIC image column sizes to 5MB (5,000,000 characters)
    # This should handle large base64 encoded images
    op.alter_column('pending_vendor_verifications', 'cnic_front_image',
               existing_type=sa.String(length=1000000),
               type_=sa.String(length=5000000),
               existing_nullable=True)
    op.alter_column('pending_vendor_verifications', 'cnic_back_image',
               existing_type=sa.String(length=1000000),
               type_=sa.String(length=5000000),
               existing_nullable=True)
    op.alter_column('vendors', 'cnic_front_image',
               existing_type=sa.String(length=1000000),
               type_=sa.String(length=5000000),
               existing_nullable=True)
    op.alter_column('vendors', 'cnic_back_image',
               existing_type=sa.String(length=1000000),
               type_=sa.String(length=5000000),
               existing_nullable=True)


def downgrade() -> None:
    # Revert CNIC image column sizes back to 1MB
    op.alter_column('vendors', 'cnic_back_image',
               existing_type=sa.String(length=5000000),
               type_=sa.String(length=1000000),
               existing_nullable=True)
    op.alter_column('vendors', 'cnic_front_image',
               existing_type=sa.String(length=5000000),
               type_=sa.String(length=1000000),
               existing_nullable=True)
    op.alter_column('pending_vendor_verifications', 'cnic_back_image',
               existing_type=sa.String(length=5000000),
               type_=sa.String(length=1000000),
               existing_nullable=True)
    op.alter_column('pending_vendor_verifications', 'cnic_front_image',
               existing_type=sa.String(length=5000000),
               type_=sa.String(length=1000000),
               existing_nullable=True)
