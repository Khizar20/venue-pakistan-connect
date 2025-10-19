"""add_video_to_venues

Revision ID: 1bf8e75298a3
Revises: 4dcf2f5e38a2
Create Date: 2025-10-19 20:29:31.686681

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1bf8e75298a3'
down_revision = '4dcf2f5e38a2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add video column to venues
    op.add_column('venues', sa.Column('video', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove video column from venues
    op.drop_column('venues', 'video')
