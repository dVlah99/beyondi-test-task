import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../shared/services/authService/auth.service';
import { ProductService } from '../../../shared/services/productsService/product.service';
import { Product } from '../../../shared/types/product.type';
import { ProductDialogComponent } from '../../product-dialog/product-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-view-product',

  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css',
})
export class ViewProductComponent {
  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductService,
    private toastr: ToastrService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {}
  @Output() toggleEditModeOutput = new EventEmitter<boolean>();
  canModifyProduct!: boolean;
  menuItems = [
    {
      label: 'Edit product',
      icon: 'pi pi-users',
      command: () => this.toggleEditMode(),
      visible: this.canModifyProduct,
    },
    {
      label: 'Delete product',
      icon: 'pi pi-sign-out',
      command: () => this.deleteProduct(),
      visible: this.canModifyProduct,
    },
  ];

  async ngOnInit() {
    this.canModifyProduct = await this.authService.checkUserPermissions(
      this.product
    );
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected product?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.productService.deleteProduct(this.product.id);
        this.dialogRef.close();
        this.toastr.success('Product succesfully deleted!', 'Success');
        this.deleteProduct();
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleEditMode() {
    this.toggleEditModeOutput.emit(true);
  }

  async deleteProduct() {
    this.confirmDelete();
  }
}
