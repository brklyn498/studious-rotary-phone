"""
Core models - Base classes for all models.
"""

from django.db import models


class TimestampedModel(models.Model):
    """
    Abstract base model with created/updated timestamps.
    All models should inherit from this.
    """
    created_at = models.DateTimeField(
        'Дата создания',
        auto_now_add=True,
        db_index=True
    )
    updated_at = models.DateTimeField(
        'Дата обновления',
        auto_now=True
    )

    class Meta:
        abstract = True


class OrderedMixin(models.Model):
    """
    Mixin for ordering field.
    """
    order = models.PositiveIntegerField(
        'Порядок',
        default=0,
        db_index=True
    )

    class Meta:
        abstract = True


class ActiveMixin(models.Model):
    """
    Mixin for is_active flag.
    """
    is_active = models.BooleanField(
        'Активен',
        default=True,
        db_index=True
    )

    class Meta:
        abstract = True

    @classmethod
    def get_active(cls):
        """Get only active items."""
        return cls.objects.filter(is_active=True)
